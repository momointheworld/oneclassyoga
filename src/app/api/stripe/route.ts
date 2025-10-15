import { format } from 'date-fns';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { email, teacher_slug, date, time_slot, participants, booking_type } =
    body;

  if (!booking_type) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  // Fetch teacher rates from your DB (Supabase example)
  const { data: teacher } = await supabase
    .from('teachers')
    .select('id, name, rates, stripe_product_id')
    .eq('slug', teacher_slug)
    .single();

  if (!teacher)
    return NextResponse.json({ error: 'Teacher not found' }, { status: 400 });

  // Calculate dynamic total
  const rates = teacher.rates;
  let total = 0;
  if (booking_type === 'single') total = rates.single;
  if (booking_type === 'bundle3') total = rates.bundle3;
  if (booking_type === 'bundle6') total = rates.bundle6;

  // Extra participant
  if (participants === 2) {
    total +=
      booking_type === 'single'
        ? 800
        : booking_type === 'bundle3'
          ? 2400
          : 4800;
  }

  // Convert to smallest currency unit (THB -> satang)
  const unitAmount = total * 100;

  // Base session config
  const sessionOptions: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: [
      'card',
      // 'wechat_pay',
      // 'alipay',
      'naver_pay',
      'kakao_pay',
      'kr_card',
      'eps',
      'ideal',
    ],
    payment_method_options: {
      wechat_pay: { client: 'web' },
    },

    mode: 'payment',
    customer_email: email,
    customer_creation: 'always',
    success_url: '',
    cancel_url: '',
  };

  try {
    // Fetch teacher if provided
    let teacherName: string | null = null;
    if (teacher_slug) {
      const { data: teacher } = await supabase
        .from('teachers')
        .select('slug')
        .eq('slug', teacher_slug)
        .single();

      if (teacher) {
        teacherName = teacher.slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase());
      }
    }

    const formattedDate = date ? format(new Date(date), 'MMMM d, yyyy') : '';

    async function convertThbToHkd(amountInTHB: number) {
      try {
        const res = await fetch(
          'https://api.exchangerate.host/convert?from=THB&to=HKD'
        );
        const data = await res.json();
        const rate = data?.info?.rate || 0;
        if (!rate) throw new Error('Failed to get conversion rate');
        // Convert and round to nearest integer (Stripe expects cents)
        return Math.round(amountInTHB / rate);
      } catch (err) {
        console.error('Currency conversion error:', err);
        // Fallback: assume a fixed rate if API fails
        const fallbackRate = 4.5;
        return Math.round(amountInTHB / fallbackRate);
      }
    }

    // Before setting unit_amount, convert the price
    const unitAmountInHKD = await convertThbToHkd(unitAmount); // unitAmount is in THB

    // Line items differ based on booking_type
    if (booking_type === 'single') {
      sessionOptions.line_items = [
        {
          price_data: {
            currency: 'hkd',
            product: teacher.stripe_product_id,
            unit_amount: unitAmountInHKD * 100, // Stripe expects cents
          },
          quantity: 1,
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
            maximum: 2,
          },
        },
      ];
    } else if (booking_type.startsWith('bundle')) {
      sessionOptions.line_items = [
        {
          price_data: {
            currency: 'hkd',
            product: teacher.stripe_product_id,
            unit_amount: unitAmountInHKD * 100, // Stripe expects cents
          },
          quantity: 1,
        },
      ];
    } else {
      return NextResponse.json(
        { error: 'Invalid booking_type' },
        { status: 400 }
      );
    }

    // ✅ Metadata is now always stored, regardless of type
    sessionOptions.metadata = {
      teacher_slug: teacher_slug || '',
      date: date || '',
      time_slot: time_slot || '',
      participants: participants?.toString() || '',
      booking_type,
      quantity: booking_type === 'single' ? 'dynamic' : '1',
    };

    // Custom fields (visible in checkout page)
    if (teacherName && date && time_slot) {
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
    }

    // Success / cancel URLs differ
    if (booking_type === 'single') {
      sessionOptions.success_url = `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&teacher=${teacher_slug}&date=${date}&timeSlot=${time_slot}&participants=${participants}`;
      sessionOptions.cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/teachers/${teacher_slug}`;
    } else {
      sessionOptions.success_url = `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&bundle=true&teacher=${teacher_slug}&date=${date}&timeSlot=${time_slot}&participants=${participants}`;
      sessionOptions.cancel_url = `${process.env.NEXT_PUBLIC_SITE_URL}/teachers/${teacher_slug}`;
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
