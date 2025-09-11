import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    const { token, rating, review_text } = body;

    if (!token || !rating) {
      console.log('Missing token or rating');
      return NextResponse.json(
        { error: 'Missing token or rating' },
        { status: 400 }
      );
    }

    // Find the booking associated with the token
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('id, teacher_id, teacher_slug, customer_name, customer_email')
      .eq('review_token', token)
      .single();

    console.log('Booking fetched:', booking, 'Error:', bookingError);

    if (bookingError || !booking) {
      console.log('Invalid review token');
      return NextResponse.json(
        { error: 'Invalid review token' },
        { status: 404 }
      );
    }

    const teacherName = booking.teacher_slug
      ? booking.teacher_slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase())
      : '';

    // Insert the review
    const { error: insertError } = await supabase.from('reviews').insert({
      booking_id: booking.id,
      teacher_id: booking.teacher_id,
      teacher_slug: booking.teacher_slug,
      teacher_name: teacherName,
      email: booking.customer_email,
      customer_name: booking.customer_name,
      rating,
      review_text,
      status: 'pending',
      token,
    });

    console.log('Insert review error:', insertError);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Mark review_sent and review_submitted as true on booking
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ review_sent: true, review_submitted: true })
      .eq('id', booking.id);

    console.log('Update booking error:', updateError);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Internal server error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
