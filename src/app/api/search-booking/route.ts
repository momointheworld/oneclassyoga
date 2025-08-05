import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Define TypeScript interfaces
interface Booking {
  time_slot: string;
}

interface SupabaseResponse {
  data: Booking[] | null;
  error: unknown;
}

// Initialize Supabase client with proper typing
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase environment variables are not properly configured');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const teacherSlug: string | null = searchParams.get('teacherSlug');
    const dateStr: string | null = searchParams.get('date');

    // Validate required parameters
    if (!teacherSlug || !dateStr) {
      return NextResponse.json(
        { error: 'Both teacherSlug and date parameters are required' },
        { status: 400 }
      );
    }

    // Query Supabase with typed response
    const { data, error }: SupabaseResponse = await supabase
      .from('bookings')
      .select('time_slot')
      .eq('teacher_slug', teacherSlug)
      .eq('date', dateStr);

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Type the response
    const responseData: { bookedTimeSlots: string[] } = {
      bookedTimeSlots: data?.map((entry: Booking) => entry.time_slot) || [],
    };

    return NextResponse.json(responseData);
  } catch (error: unknown) {
    console.error('API route error:', error);
    const errorMessage: string =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
        bookedTimeSlots: [],
      },
      { status: 500 }
    );
  }
}
