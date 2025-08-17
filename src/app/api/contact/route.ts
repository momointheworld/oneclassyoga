import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

type ContactRequestBody = {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
};

export async function POST(req: Request) {
  try {
    const body: ContactRequestBody = await req.json();
    const { name, email, message, recaptchaToken } = body;

    // Basic validation
    const errors: Partial<ContactRequestBody> = {};
    if (!name?.trim()) errors.name = 'Name is required';
    if (!email?.trim()) errors.email = 'Email is required';
    if (!message?.trim()) errors.message = 'Message is required';
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { errors: { email: 'Invalid email address' } },
        { status: 400 }
      );
    }

    // reCAPTCHA v3 verification
    const secret = process.env.RECAPTCHA_SECRET_KEY!;
    const recaptchaResp = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(
          recaptchaToken
        )}`,
      }
    );

    const recaptchaData = await recaptchaResp.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return NextResponse.json(
        { message: 'Failed reCAPTCHA verification' },
        { status: 403 }
      );
    }

    // Send email via Resend
    const supportEmail = process.env.SUPPORT_EMAIL;
    if (!supportEmail) throw new Error('SUPPORT_EMAIL is not set');

    const { error } = await resend.emails.send({
      from: `Support <${process.env.FROM_EMAIL}>`,
      to: supportEmail,
      subject: `New Contact Message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
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
