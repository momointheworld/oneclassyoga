import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
    );
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve the customer details
      const customer = (await stripe.customers.retrieve(
        session.customer as string,
      )) as Stripe.Customer;

      const metadata = session.metadata || {};
      const booking_type = metadata.booking_type || 'single';
      const teacher_slug = metadata.teacher_slug || null;
      const date = metadata.date || null;
      const time_slot = metadata.time_slot || null;
      const participants = metadata.participants || null;
      const package_title = metadata.package_title || null;
      const locale = metadata.locale || null;
      let bundleSize: number | null = null;
      if (metadata.booking_type?.startsWith('bundle')) {
        bundleSize = parseInt(metadata.booking_type.replace('bundle', ''), 10);
      }
      let teacherId = null;

      // ✅ Always try to resolve teacherId if teacher_slug exists
      if (teacher_slug) {
        const { data: teacher, error: teacherError } = await supabase
          .from('teachers')
          .select('id, slug')
          .eq('slug', teacher_slug)
          .single();

        if (teacherError || !teacher) {
          throw new Error('Teacher not found');
        }

        teacherId = teacher.id;
      }

      function generateReviewToken() {
        return randomBytes(32).toString('hex'); // 64-char hex string
      }

      // ✅ Insert into bookings (same structure for single and bundle)
      const { error: insertError } = await supabase.from('bookings').insert({
        session_id: session.id,
        booking_type,
        package_title,
        teacher_slug,
        teacher_id: teacherId,
        customer_name: customer.name || '',
        customer_email: customer.email || session.customer_email || '',
        date,
        time_slot,
        bundle_size: bundleSize,
        participants: parseInt(participants || '1', 10),
        payment_intent: session.payment_intent as string,
        locale: locale || '',
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
        createdAt: new Date().toISOString(),
        bundle_id: bundleSize ? session.id : null, // Use session ID as bundle_id for bundles
        review_sent: false,
        review_submitted: false,
        review_approved: false,
        review_token: generateReviewToken(),
      });

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error handling checkout.session.completed:', error);
      return NextResponse.json(
        { error: 'Webhook handler failed' },
        { status: 500 },
      );
    }
  }

  // Return a 200 response for unhandled event types
  return NextResponse.json({ received: true });
}
