/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function slugify(name: string, p0: { lower: boolean; strict: boolean }) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET() {
  try {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch teachers' },
        { status: 500 },
      );
    }

    return NextResponse.json(teachers);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Create slug from name
    const slug = slugify(data.name, { lower: true, strict: true });

    // Insert into supabase table
    const { data: created, error } = await supabase
      .from('teachers')
      .insert({
        ...data, // Spread the incoming data
        slug, // Override with the server-generated slug
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to create teacher' },
        { status: 500 },
      );
    }

    return NextResponse.json(created);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to create teacher' },
      { status: 500 },
    );
  }
}
