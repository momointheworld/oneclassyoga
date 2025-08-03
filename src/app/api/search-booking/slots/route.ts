import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date'); // Expecting format "2025-07-31"
  const teacherSlug = searchParams.get('teacherSlug');
  const timeSlot = searchParams.get('timeSlot');

  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  }

  if (!teacherSlug) {
    return NextResponse.json(
      { error: 'teacherSlug parameter is required' },
      { status: 400 }
    );
  }

  try {
    // First set the teacher context for RLS
    const { error: contextError } = await supabase.rpc('set_teacher_context', {
      teacher_slug: teacherSlug,
    });

    if (contextError) {
      throw contextError;
    }

    // Then query the safe_bookings view
    let query = supabase
      .from('safe_bookings')
      .select('time_slot, teacher_slug, session_id, participants')
      .eq('date', date)
      .eq('teacher_slug', teacherSlug); // This will match the RLS policy

    if (timeSlot) {
      query = query.eq('time_slot', timeSlot);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch slots', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bookings: data || [],
      bookedTimeSlots: data?.map((entry) => entry.time_slot) || [],
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
