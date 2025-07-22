import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use service role if you're querying with admin privileges
);

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('id, date, time_slot, teacher_slug, session_id')
      .eq('session_id', bookingId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        {
          error:
            error.code === '42501' ? 'Permission denied' : 'Booking not found',
        },
        { status: error.code === '42501' ? 403 : 404 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
