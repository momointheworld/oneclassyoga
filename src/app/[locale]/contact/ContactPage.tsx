'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { Loader2Icon } from 'lucide-react';
import Turnstile from 'react-turnstile';
import { useTranslations } from 'next-intl';

type FormData = {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string;
};

function ContactForm() {
  const t = useTranslations('Contact.form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<FormData>>({});
  const [generalError, setGeneralError] = useState('');
  const [showTurnstile, setShowTurnstile] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const submitForm = async (dataToSubmit: FormData) => {
    setLoading(true);
    setFieldErrors({});
    setGeneralError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 400 && data.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(data.message || t('errors.general'));
      }
    } catch (err) {
      console.error(err);
      setGeneralError(t('errors.general'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');

    if (!formData.turnstileToken) {
      setShowTurnstile(true);
      setGeneralError(t('errors.verify'));
      return;
    }

    await submitForm(formData);
  };

  const handleTurnstileVerify = async (token: string) => {
    const updatedFormData = { ...formData, turnstileToken: token };
    setFormData(updatedFormData);
    setFieldErrors({});
    setGeneralError('');
    await submitForm(updatedFormData);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl">
        <p className="text-lg font-semibold">{t('success.title')}</p>
        <p className="text-sm mt-1">{t('success.message')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          {t('labels.name')}
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder={t('placeholders.name')}
        />
        {fieldErrors.name && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {t('labels.email')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder={t('placeholders.email')}
        />
        {fieldErrors.email && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {t('labels.message')}
        </label>
        <Textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder={t('placeholders.message')}
        />
        {fieldErrors.message && (
          <p className="text-red-500 text-sm mt-1">{fieldErrors.message}</p>
        )}
      </div>

      {showTurnstile && (
        <div className="turnstile-wrapper">
          <Turnstile
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onVerify={handleTurnstileVerify}
            theme="light"
            size="normal"
          />
        </div>
      )}

      <Button
        variant="outline"
        type="submit"
        disabled={loading}
        className="rounded-full px-6 flex items-center justify-center hover:bg-gray-200 transition"
      >
        {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2" />}
        {loading
          ? t('buttons.sending')
          : showTurnstile
            ? t('buttons.verifying')
            : t('buttons.send')}
      </Button>
      {generalError && <p className="text-orange-500 mt-2">{generalError}</p>}
    </form>
  );
}

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">{t('header.title')}</h1>
        <p className="text-gray-600 mb-10">{t('header.subtitle')}</p>

        <ContactForm />
      </div>
    </PageContainer>
  );
}
