import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const body = await req.json();
  const {
    email,
    priceId,
    teacher_slug,
    date,
    time_slot,
    participants,
    booking_type, // Correct name
  } = body;

  if (!priceId || !booking_type) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Base session config
  const sessionOptions: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: [
      'card',
      'wechat_pay',
      'alipay',
      'naver_pay',
      'kakao_pay',
      'kr_card',
      'sepa_debit',
      'eps',
      'ideal',
      'sofort',
      'giropay',
    ],
    payment_method_options: {
      wechat_pay: {
        client: 'web', // required for Checkout
      },
    },
    mode: 'payment',
    customer_email: email,
    customer_creation: 'always',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: '',
    cancel_url: '',
  };

  try {
    if (booking_type === 'single') {
      if (!teacher_slug || !date || !time_slot || !participants) {
        return NextResponse.json(
          { error: 'Missing single-session booking info' },
          { status: 400 }
        );
      }

      // Fetch teacher
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .select('id, slug, name')
        .eq('slug', teacher_slug)
        .single();

      if (teacherError || !teacher) {
        return NextResponse.json(
          { error: 'Teacher not found' },
          { status: 404 }
        );
      }

      const teacherName = teacher.slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase());

      const formattedDate = format(new Date(date), 'MMMM d, yyyy');

      sessionOptions.metadata = {
        teacher_slug,
        date,
        time_slot,
        participants,
        booking_type,
      };

      sessionOptions.custom_fields = [
        {
          key: 'appointment_date',
          label: { type: 'custom', custom: 'Appointment Date' },
          type: 'text',
          text: {
            default_value: `Yoga with ${teacherName} on ${formattedDate} at ${time_slot}`,
          },
          optional: false,
        },
      ];

      sessionOptions.success_url = `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&teacher=${teacher.slug}&date=${date}&timeSlot=${time_slot}&participants=${participants}`;
      sessionOptions.cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/teachers/${teacher.slug}`;
    } else if (booking_type === 'bundle') {
      sessionOptions.metadata = {
        booking_type,
      };
      sessionOptions.success_url = `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&bundle=true`;
      sessionOptions.cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`;
    } else {
      return NextResponse.json(
        { error: 'Invalid booking_type' },
        { status: 400 }
      );
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);

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
