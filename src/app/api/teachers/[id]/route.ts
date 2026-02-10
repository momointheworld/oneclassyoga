import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }, // Note the Promise wrapper
) {
  // Await the params promise to get the actual ID
  try {
    const { id } = await params; // Await the params promise
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { error: 'Invalid teacher ID' },
        { status: 400 },
      );
    }

    const { error } = await supabase.from('teachers').delete().eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete teacher' },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function slugify(name: string, p0: { lower: boolean; strict: boolean }) {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const updatePayload = { ...data };
    delete updatePayload.id; // Safety first!

    if (data.name) {
      updatePayload.slug = slugify(data.name, { lower: true, strict: true });
    }

    const { data: updated, error } = await supabase
      .from('teachers')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Ensure returning the data object
    return NextResponse.json(updated || { success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
