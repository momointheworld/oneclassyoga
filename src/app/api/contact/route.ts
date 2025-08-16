import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, message, recaptchaToken } = body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // reCAPTCHA verification
    const secret = process.env.RECAPTCHA_SECRET_KEY!;

    const resp = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${recaptchaToken}`,
      { method: 'POST' }
    );

    const data = await resp.json();

    if (!data.success || data.score < 0.5) {
      return NextResponse.json(
        { message: 'Failed reCAPTCHA verification.' },
        { status: 403 }
      );
    }

    // Send email
    const supportEmail = process.env.SUPPORT_EMAIL;
    if (!supportEmail) {
      throw new Error('SUPPORT_EMAIL is not set in environment variables');
    }

    const { error } = await resend.emails.send({
      from: `Support <${process.env.FROM_EMAIL}>`,
      to: supportEmail,
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
