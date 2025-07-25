import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NOT the anon key
);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve the customer details
      const customer = (await stripe.customers.retrieve(
        session.customer as string
      )) as Stripe.Customer;

      // Get the metadata from the session
      const { teacher_slug, date, time_slot, participants } =
        session.metadata || {};

      if (!teacher_slug || !date || !time_slot) {
        throw new Error('Missing required metadata');
      }

      console.log(
        `Processing booking for teacher: ${teacher_slug}, date: ${date}, timeSlot: ${time_slot}, participants: ${participants} `
      );

      console.log('teacher_slug from metadata:', teacher_slug);
      console.log(session.metadata);

      // Fetch teacher info
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('id, slug, name')
        .eq('slug', teacher_slug)
        .single();

      console.log('teacherError', teacherError);
      console.log('teacherSlug', teacher_slug);

      if (teacherError || !teacher) {
        throw new Error('Teacher not found');
      }

      // Insert booking into Supabase
      const { error: insertError } = await supabase.from('bookings').insert({
        session_id: session.id,
        teacher_slug: teacher.slug,
        teacher_id: teacher.id,
        customer_name: customer.name || '',
        customer_email: customer.email || session.customer_email || '',
        date,
        time_slot: time_slot,
        participants: parseInt(participants || '1', 10), // Default to 1 if not provided
        payment_intent: session.payment_intent as string,
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      });

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error handling checkout.session.completed:', error);
      return NextResponse.json(
        { error: 'Webhook handler failed' },
        { status: 500 }
      );
    }
  }

  // Return a 200 response for unhandled event types
  return NextResponse.json({ received: true });
}
