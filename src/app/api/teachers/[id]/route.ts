import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Note the Promise wrapper
) {
  // Await the params promise to get the actual ID
  try {
    const { id } = await params; // Await the params promise
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid teacher ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('teachers').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete teacher' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
