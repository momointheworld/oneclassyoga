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
      'customer_email, customer_name, teacher_slug, date, time_slot, participants, booking_type, package_title, locale',
    )
    .eq('session_id', sessionId)
    .single();

  if (error || !booking)
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  try {
    const isZh = booking.locale === 'zh';
    const isBundle = booking.booking_type.startsWith('bundle');
    const packageDisplayName =
      booking.package_title || (isZh ? '瑜伽课程' : 'Yoga Session');

    const teacherName = booking.teacher_slug
      ? booking.teacher_slug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, (char: string) => char.toUpperCase())
      : '';

    // --- Translation Content ---
    const content = {
      subject: isZh
        ? `您的 ${packageDisplayName} 预约已确认！🌸`
        : isBundle
          ? `Your ${packageDisplayName} is Confirmed! 🌸`
          : 'Your Yoga Class Booking is Confirmed! 🌸',
      title: isZh ? '🎉 预约确认成功！' : '🎉 Booking Confirmed!',
      greeting: isZh
        ? `您好 ${booking.customer_name},`
        : `Hello ${booking.customer_name},`,
      thankYou: isZh
        ? '感谢您在 OneClass Yoga 预约课程。'
        : 'Thank you for booking with OneClass Yoga.',
      bundleNote: isZh
        ? `您已购买 <strong>${packageDisplayName}</strong>。您的<strong>第一节课</strong>已确认，后续课程将由您的老师为您安排。🌿`
        : `You’ve purchased the <strong>${packageDisplayName}</strong>. Your <strong>first class</strong> is now confirmed, and the rest of your sessions will be scheduled together with your teacher. 🌿`,
      detailsHeader: isZh ? '预约详情如下：' : 'Here are your booking details:',
      labelPackage: isZh ? '课程套餐' : 'Package',
      labelTeacher: isZh ? '老师' : 'Teacher',
      labelDate: isZh ? '日期' : 'Date',
      labelTime: isZh ? '时间' : 'Time',
      labelParticipants: isZh ? '人数' : 'Participants',
      labelRef: isZh ? '预约编号' : 'Booking Reference',
      locationLabel: isZh ? '📍 地点：' : '📍 Location:',
      policy: isZh
        ? '🔔 请注意：如需更改或取消预约，请至少<strong>提前 48 小时</strong>通知。由于老师档期紧凑，请准时（或提前 5-10 分钟）到达，以便在课前安顿身心。'
        : '🔔 Please note: Any changes or rescheduling must be made at least <strong>48 hours in advance</strong>. We kindly ask that you arrive on time (or 5–10 minutes earlier) so you can settle in before class begins.',
      closing: isZh
        ? '期待在瑜伽垫上见到您！🧘‍♀️'
        : 'Looking forward to seeing you on the mat! 🧘‍♀️',
      regards: isZh ? '顺颂时祺,' : 'Warm regards,',
    };

    const bundleNoteHtml = isBundle
      ? `<p style="margin-bottom:16px;">${content.bundleNote}</p>`
      : '';

    const html = `
  <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6; font-size:16px; max-width:600px; margin:0 auto; padding:20px;">
    <h2 style="font-size:22px; color:#222; margin-bottom:16px;">${content.title}</h2>
    
    <p style="margin-bottom:12px;">${content.greeting}</p>
    
    <p style="margin-bottom:16px;">
      ${content.thankYou}
      ${bundleNoteHtml}
    </p>
    
    <h3 style="font-size:18px; color:#222; margin-bottom:12px;">${content.detailsHeader}</h3>
    <ul style="margin-bottom:16px; padding-left:20px;">
      <li><strong>${content.labelPackage}:</strong> ${packageDisplayName}</li>
      ${teacherName ? `<li><strong>${content.labelTeacher}:</strong> ${teacherName}</li>` : ''}
      ${booking.date ? `<li><strong>${content.labelDate}:</strong> ${booking.date}</li>` : ''}
      ${booking.time_slot ? `<li><strong>${content.labelTime}:</strong> ${booking.time_slot}</li>` : ''}
      ${booking.participants ? `<li><strong>${content.labelParticipants}:</strong> ${booking.participants}</li>` : ''}
      <li><strong>${content.labelRef}:</strong> ${sessionId}</li>
    </ul>

    <p style="margin-bottom:16px;">
      <strong>${content.locationLabel}</strong> 
      <a href="https://goo.gl/maps/NtM7puFG5Loq5Qwv6" 
         style="color:#1a73e8; text-decoration:none;" target="_blank">
         The Bodhi Tree House
      </a>
    </p>

    <p style="margin-bottom:16px; color:#444;">
      ${content.policy}
    </p>

    <p style="margin-bottom:24px;">${content.closing}</p>

    <div style="border-top:1px solid #ddd; padding-top:16px; margin-top:24px; font-size:14px; color:#555;">
      <p style="margin:0 0 6px 0;">
        ${content.regards}<br />
        <strong style="font-size:16px; color:#111;">Lifen Li</strong><br />
        <span style="color:#666;">OneClass Yoga</span>
      </p>
      <p style="margin:6px 0;">
        <a href="https://oneclass.yoga" style="color:#1a73e8; text-decoration:none; font-weight:500;">
          oneclass.yoga
        </a>
      </p>
    </div>
  </div>
`;

    // Simplistic text fallback
    const text = `${content.title}\n\n${content.greeting}\n\n${content.thankYou}\n${isBundle ? content.bundleNote.replace(/<[^>]*>/g, '') : ''}\n\n${content.detailsHeader}\n- ${content.labelPackage}: ${packageDisplayName}\n${teacherName ? `- ${content.labelTeacher}: ${teacherName}\n` : ''}- ${content.labelRef}: ${sessionId}\n\n${content.closing}`;

    await resend.emails.send({
      from: 'OneClass Yoga <support@oneclass.yoga>',
      to: booking.customer_email,
      subject: content.subject,
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
