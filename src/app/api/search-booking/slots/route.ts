import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // Expecting format "2025-07-31"

  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('time_slot')
    .eq('date', date);

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slots' },
      { status: 500 }
    );
  }

  const bookedTimeSlots = data.map((entry) => entry.time_slot);

  return NextResponse.json({ bookedTimeSlots });
}
