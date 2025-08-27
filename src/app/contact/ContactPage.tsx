'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { Loader2Icon } from 'lucide-react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

type FormData = {
  name: string;
  email: string;
  message: string;
};

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormData>>({});
  const [generalError, setGeneralError] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      if (!executeRecaptcha) {
        setGeneralError('reCAPTCHA is not ready. Please try again later.');
        setLoading(false);
        return;
      }

      const token = await executeRecaptcha('contact_form_submit');

      if (!token) {
        setGeneralError('reCAPTCHA verification failed. Please try again.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken: token }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 400 && data.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(
          data.message || 'Something went wrong. Please try again later.'
        );
      }
    } catch (err) {
      console.error(err);
      setGeneralError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl">
        <p className="text-lg font-semibold">Thank you!</p>
        <p className="text-sm mt-1">
          Your message has been sent. We&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
        />
        {fieldErrors.name && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder="What would you like to ask or say?"
        />
        {fieldErrors.message && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.message}</p>
        )}
      </div>

      <Button
        variant="outline"
        type="submit"
        disabled={loading}
        className="rounded-full px-6 flex items-center justify-center hover:bg-gray-200 transition"
      >
        {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
        {loading ? 'Sending...' : 'Send Message'}
      </Button>

      {generalError && <p className="text-orange-500 mt-2">{generalError}</p>}
    </form>
  );
}

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-10">
          Have a question or need help? Fill out the form below and we’ll get
          back to you as soon as we can.
        </p>

        {/* Wrap the form with GoogleReCaptchaProvider */}
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          scriptProps={{ async: true, defer: true, appendTo: 'head' }}
        >
          <ContactForm />
        </GoogleReCaptchaProvider>
      </div>
    </PageContainer>
  );
}
