import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const teacherSlug = searchParams.get('teacher');
    const date = searchParams.get('date');
    const timeSlot = searchParams.get('timeSlot');
    const participants = searchParams.get('participants');

    if (!sessionId && !teacherSlug && !date && !timeSlot) {
      return NextResponse.json(
        { error: 'At least one search parameter is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('safe_bookings')
      .select('id, date, time_slot, teacher_slug, session_id, participants');

    if (sessionId) query = query.eq('session_id', sessionId);
    if (teacherSlug) query = query.eq('teacher_slug', teacherSlug);
    if (date) query = query.eq('date', date);
    if (timeSlot) query = query.eq('time_slot', timeSlot);
    if (participants) query = query.eq('participants', participants);

    const { data, error } = await query.maybeSingle();

    if (error) throw error;
    if (!data)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    return NextResponse.json({ booking: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
