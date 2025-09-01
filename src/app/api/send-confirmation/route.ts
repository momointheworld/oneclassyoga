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
      'customer_email, customer_name, teacher_slug, date, time_slot, participants, booking_type, bundle_size'
    )
    .eq('session_id', sessionId)
    .single();

  if (error || !booking)
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  try {
    const teacherName = booking.teacher_slug
      ? booking.teacher_slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase())
      : '';

    const isBundle =
      booking.booking_type === 'bundle5' || booking.booking_type === 'bundle10';
    const bundleSize = booking.booking_type === 'bundle5' ? 5 : 10;

    const subject = isBundle
      ? 'Your Yoga Class Bundle is Confirmed! 🌸'
      : 'Your Yoga Class Booking is Confirmed! 🌸';

    const bundleNote = isBundle
      ? `<p style="margin-bottom:16px;">
          You’ve purchased a <strong>${bundleSize}-class bundle</strong>.  
          Your <strong>first class</strong> is now confirmed, and the rest of your sessions will be scheduled together with your teacher. 🌿
        </p>`
      : '';

    const html = `
      <div style="font-family:Arial, sans-serif; color:#333; line-height:1.5; font-size:16px;">
        <h2 style="font-size:22px; color:#222; margin-bottom:16px;">🎉 Booking Confirmed!</h2>
        
        <p style="margin-bottom:12px;">Hi ${booking.customer_name},</p>
        
        <p style="margin-bottom:16px;">
          Thank you for booking with OneClass Yoga. We’re excited to welcome you and make your experience enjoyable and relaxing.
        </p>
        
        <h3 style="font-size:18px; color:#222; margin-bottom:12px;">Here are your booking details:</h3>
        <ul style="margin-bottom:16px; padding-left:20px;">
          ${teacherName ? `<li><strong>Teacher:</strong> ${teacherName}</li>` : ''}
          ${booking.date ? `<li><strong>Date:</strong> ${booking.date}</li>` : ''}
          ${booking.time_slot ? `<li><strong>Time:</strong> ${booking.time_slot}</li>` : ''}
          ${booking.participants ? `<li><strong>Participants:</strong> ${booking.participants}</li>` : ''}
          <li><strong>Booking Reference:</strong> ${sessionId}</li>
        </ul>

        ${bundleNote}

        <p style="margin-bottom:16px;">
          If you have any questions or need to make changes, feel free to reach out to us at <strong>support@oneclass.yoga</strong>. We’re happy to help!
        </p>
        
        <p style="margin-bottom:16px;">Looking forward to seeing you on the mat! 🧘‍♀️</p>
        
        <p>Warm regards,<br />Lifen Li from OneClass Yoga</p>
        <p style="color: gray; font-size: 13px">
          Line | WhatsApp | Phone: +66-95-047-4936 </br>
          FaceBook: facebook.com/oneclassyoga </br>
          WeChat ID: OneClassYoga</br>
          Website: <a href="https://oneclass.yoga" style="color:#1a73e8; text-decoration:none;">oneclass.yoga</a>
        </p>
      </div>
    `;

    await resend.emails.send({
      from: 'OneClass Yoga <support@oneclass.yoga>',
      to: booking.customer_email,
      subject,
      html,
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
