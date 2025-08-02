// /app/api/delete-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { path } = await req.json();

  if (!path || typeof path !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid path' },
      { status: 400 }
    );
  }

  const { error } = await supabase.storage.from('teachers').remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
