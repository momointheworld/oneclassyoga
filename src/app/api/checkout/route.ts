import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('[BOOKING_API_ERROR]', error);
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 });
  }
}
