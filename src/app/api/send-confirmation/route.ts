// app/api/send-confirmation/route.ts

import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId)
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      'customer_email, customer_name, teacher_slug, date, time_slot, participants'
    )
    .eq('session_id', sessionId)
    .single();

  if (error || !booking)
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  try {
    // Capitalize words
    const teacherName = booking.teacher_slug
      ? booking.teacher_slug
          .replace(/-/g, ' ') // replace dashes with spaces
          .replace(/\b\w/g, (char: string) => char.toUpperCase()) // capitalize first letter of each word
      : '';
    await resend.emails.send({
      from: 'OneClass Yoga <support@oneclass.yoga>',
      to: booking.customer_email,
      subject: 'Your Yoga Class Booking is Confirmed! 🌸',
      html: `
    <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5; font-size:16px;">
      <h2 style="font-size:22px; color:#222; margin-bottom:16px;">🎉 Booking Confirmed!</h2>
      
      <p style="margin-bottom:12px;">Hi ${booking.customer_name},</p>
      
      <p style="margin-bottom:16px;">
        Thank you so much for booking a class with OneClass Yoga. We’re excited to welcome you and make your experience enjoyable and relaxing.
      </p>
      
      <h3 style="font-size:18px; color:#222; margin-bottom:12px;">Here are your booking details:</h3>
      <ul style="margin-bottom:16px; padding-left:20px;">
        <li><strong>Teacher:</strong> ${teacherName}</li>
        <li><strong>Date:</strong> ${booking.date}</li>
        <li><strong>Time:</strong> ${booking.time_slot}</li>
        <li><strong>Participants:</strong> ${booking.participants}</li>
        <li><strong>Booking Reference:</strong> ${sessionId}</li>
      </ul>
      
      <p style="margin-bottom:16px;">
        If you have any questions or need to make changes, feel free to reach out to us at <strong>support@oneclass.yoga</strong>. We’re happy to help!
      </p>
      
      <p style="margin-bottom:16px;">Looking forward to seeing you on the mat! 🧘‍♀️</p>
      
      <p>Warm regards,<br />Lifen Li from OneClass Yoga</p>
    </div>
  `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
