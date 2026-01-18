// app/api/send-confirmation/route.ts

import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();
  if (!sessionId)
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      'customer_email, customer_name, teacher_slug, date, time_slot, participants, booking_type, package_title',
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

    const isBundle = booking.booking_type.startsWith('bundle');

    // Use package_title if it exists, otherwise fall back to a generic description
    const packageDisplayName = booking.package_title || 'Yoga Session';

    const subject = isBundle
      ? `Your ${packageDisplayName} is Confirmed! 🌸`
      : 'Your Yoga Class Booking is Confirmed! 🌸';

    const bundleNote = isBundle
      ? `<p style="margin-bottom:16px;">
          You’ve purchased the <strong>${packageDisplayName}</strong>.  
          Your <strong>first class</strong> is now confirmed, and the rest of your sessions will be scheduled together with your teacher. 🌿
        </p>`
      : '';

    const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6; font-size:16px; max-width:600px; margin:0 auto; padding:20px;">
    <h2 style="font-size:22px; color:#222; margin-bottom:16px;">🎉 Booking Confirmed!</h2>
    
    <p style="margin-bottom:12px;">Hello ${booking.customer_name},</p>
    
    <p style="margin-bottom:16px;">
      Thank you for booking with OneClass Yoga.
      ${bundleNote}
    </p>
    
    <h3 style="font-size:18px; color:#222; margin-bottom:12px;">Here are your booking details:</h3>
    <ul style="margin-bottom:16px; padding-left:20px;">
      <li><strong>Package:</strong> ${packageDisplayName}</li>
      ${teacherName ? `<li><strong>Teacher:</strong> ${teacherName}</li>` : ''}
      ${booking.date ? `<li><strong>Date:</strong> ${booking.date}</li>` : ''}
      ${booking.time_slot ? `<li><strong>Time:</strong> ${booking.time_slot}</li>` : ''}
      ${booking.participants ? `<li><strong>Participants:</strong> ${booking.participants}</li>` : ''}
      <li><strong>Booking Reference:</strong> ${sessionId}</li>
    </ul>

    <p style="margin-bottom:16px;">
      📍 <strong>Location:</strong> 
      <a href="https://goo.gl/maps/NtM7puFG5Loq5Qwv6" 
         style="color:#1a73e8; text-decoration:none;" target="_blank">
         The Bodhi Tree House
      </a>
    </p>

    <p style="margin-bottom:16px; color:#444;">
      🔔 Please note: Any changes or rescheduling must be made at least 
      <strong>48 hours in advance</strong>, as our teachers’ schedules are tight.  
      We also kindly ask that you arrive on time (or 5–10 minutes earlier) 
      so you can settle in before class begins.
    </p>

    <p style="margin-bottom:24px;">Looking forward to seeing you on the mat! 🧘‍♀️</p>

    <div style="border-top:1px solid #ddd; padding-top:16px; margin-top:24px; font-size:14px; color:#555;">
      <p style="margin:0 0 6px 0;">
        Warm regards,<br />
        <strong style="font-size:16px; color:#111;">Lifen Li</strong><br />
        <span style="color:#666;">OneClass Yoga</span>
      </p>
      <p style="margin:6px 0;">
        <a href="https://oneclass.yoga" style="color:#1a73e8; text-decoration:none; font-weight:500;">
          oneclass.yoga
        </a>
      </p>
      <p style="margin:8px 0 0; padding:0;">
        <a href="https://youtube.com/@oneclassyoga" style="display:inline-block; margin-right:8px;">
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="22" height="22" style="display:block;" />
        </a>
        <a href="https://instagram.com/oneclassyoga" style="display:inline-block; margin-right:8px;">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="22" height="22" style="display:block;" />
        </a>
        <a href="https://facebook.com/oneclassyoga" style="display:inline-block;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="22" height="22" style="display:block;" />
        </a>
      </p>
    </div>
  </div>
`;

    const text = `
🎉 Booking Confirmed!

Hello ${booking.customer_name},

Thank you for booking with OneClass Yoga.
${isBundle ? `You’ve purchased the ${packageDisplayName}. Your first class is now confirmed, and the rest of your sessions will be scheduled together with your teacher.` : ''}

Here are your booking details:
- Package: ${packageDisplayName}
${teacherName ? `- Teacher: ${teacherName}\n` : ''}${booking.date ? `- Date: ${booking.date}\n` : ''}${booking.time_slot ? `- Time: ${booking.time_slot}\n` : ''}${booking.participants ? `- Participants: ${booking.participants}\n` : ''}- Booking Reference: ${sessionId}

📍 Location: The Bodhi Tree House
Google Maps: https://goo.gl/maps/NtM7puFG5Loq5Qwv6

🔔 Please note: Any changes or rescheduling must be made at least 48 hours in advance.

Looking forward to seeing you on the mat! 🧘‍♀️

Warm regards, Lifen Li (OneClass Yoga)
`;

    await resend.emails.send({
      from: 'OneClass Yoga <support@oneclass.yoga>',
      to: booking.customer_email,
      subject,
      html,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 },
    );
  }
}
