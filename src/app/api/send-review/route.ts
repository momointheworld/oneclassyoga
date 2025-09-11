import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { bookingId } = await req.json();

  // 1. Fetch the booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .select(
      'id, customer_email, customer_name, review_token, review_sent, teacher_slug'
    )
    .eq('id', bookingId)
    .single();

  if (error || !booking)
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  // 2. Construct review link
  const reviewLink = `${process.env.NEXT_PUBLIC_SITE_URL}/review?t=${booking.review_token}&teacher=${booking.teacher_slug}`;
  const teacherName = booking.teacher_slug
    ? booking.teacher_slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char: string) => char.toUpperCase())
    : '';

  // 3. Send email via Resend
  try {
    const html = `
      <div style="font-family:Arial, sans-serif; color:#333; line-height:1.6; font-size:16px; max-width:600px; margin:0 auto; padding:20px;">
        <h2 style="font-size:22px; color:#222; margin-bottom:16px;">📝 We'd love your feedback!</h2>
        <p style="margin-bottom:12px;">Hi ${booking.customer_name},</p>
        <p style="margin-bottom:16px;">
          We hope you enjoyed your class with <strong>${teacherName}</strong>!  
          Your feedback helps us improve our classes and support our teachers.
        </p>
        <p style="margin-bottom:16px;">
          It only takes a minute: <a href="${reviewLink}" style="color:#1a73e8; text-decoration:none;">Leave your review here</a>
        </p>
        <p style="margin-bottom:24px;">Thank you so much for sharing your experience! 🌿</p>
        <div style="border-top:1px solid #ddd; padding-top:16px; margin-top:24px; font-size:14px; color:#555;">
          <p style="margin:0 0 6px 0;">
            Warm regards,<br />
            <strong style="font-size:16px; color:#111;">Lifen Li</strong><br />
            <span style="color:#666;">OneClass Yoga</span>
          </p>
          <p style="margin:6px 0;">
            <a href="https://oneclass.yoga" style="color:#1a73e8; text-decoration:none; font-weight:500;">oneclass.yoga</a>
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
Hi ${booking.customer_name},

We hope you enjoyed your class with ${teacherName}!

We’d love to hear your thoughts. It only takes a minute:
${reviewLink}

Thank you so much for sharing your experience!

Warm regards,
Lifen Li
OneClass Yoga
https://oneclass.yoga
`;

    await resend.emails.send({
      from: 'OneClass Yoga <support@oneclass.yoga>',
      to: booking.customer_email,
      subject: `Share your feedback for your class with ${teacherName}`,
      html,
      text,
    });
  } catch (err) {
    console.error('Resend email error:', err);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }

  // 4. Mark review as sent
  const { error: updateError } = await supabase
    .from('bookings')
    .update({ review_sent: true })
    .eq('id', bookingId);

  if (updateError)
    return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
