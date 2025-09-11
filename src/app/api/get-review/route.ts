import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('t');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  // Lookup review by token
  const { data, error } = await supabase
    .from('reviews')
    .select('rating, review_text, status, teacher_name')
    .eq('token', token)
    .maybeSingle();

  if (error) {
    console.error('Supabase error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ review: null }, { status: 200 });
  }

  return NextResponse.json({ review: data }, { status: 200 });
}
