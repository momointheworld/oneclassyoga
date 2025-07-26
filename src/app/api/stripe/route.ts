import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { email, priceId, teacher_slug, date, time_slot, participants } = body;

  try {
    // Fetch teacher info
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id, slug, name')
      .eq('slug', teacher_slug)
      .single();

    if (teacherError || !teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const teacherName = teacher.slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char: string) => char.toUpperCase());

    const formattedDate = format(new Date(date), 'MMMM d, yyyy'); // → "July 22, 2025"

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      customer_creation: 'always',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        teacher_slug: teacher.slug,
        date,
        time_slot: time_slot,
        participants: participants,
      },
      custom_fields: [
        {
          key: 'appointment_date',
          label: {
            type: 'custom',
            custom: 'Appointment Date',
          },
          type: 'text',
          text: {
            default_value: `Yoga with ${teacherName} on ${formattedDate} at ${time_slot}`,
          },
          optional: false,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&teacher=${teacher.slug}&date=${date}&timeSlot=${time_slot}&participants=${participants}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/teachers/${teacher.slug}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('[Stripe Checkout Error]', err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    console.error('[Stripe Checkout Unknown Error]', err);
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}
