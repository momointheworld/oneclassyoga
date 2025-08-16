'use client';

import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { Loader2Icon } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

type FormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormData>>({});
  const [generalError, setGeneralError] = useState('');

  const recaptchaRef = useRef<ReCAPTCHA>(null);

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
      // Execute reCAPTCHA v3
      const token = await recaptchaRef.current?.executeAsync();
      recaptchaRef.current?.reset();

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

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        {!submitted ? (
          <>
            <p className="text-gray-600 mb-10">
              Have a question or need help? Fill out the form below and we’ll
              get back to you as soon as we can.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name, Email, Message inputs same as before */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
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
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                type="submit"
                disabled={loading}
                className="rounded-full px-6 flex items-center justify-center hover:bg-gray-200 transition"
              >
                {loading && (
                  <Loader2Icon className="animate-spin h-4 w-4 mr-2" />
                )}
                {loading ? 'Sending...' : 'Send Message'}
              </Button>

              {generalError && (
                <p className="text-orange-500 mt-2">{generalError}</p>
              )}

              {/* Invisible reCAPTCHA */}
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                size="invisible"
                ref={recaptchaRef}
              />
            </form>
          </>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl">
            <p className="text-lg font-semibold">Thank you!</p>
            <p className="text-sm mt-1">
              Your message has been sent. We&apos;ll get back to you soon.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
