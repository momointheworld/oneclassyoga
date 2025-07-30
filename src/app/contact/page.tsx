'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-10">
          Have a question or need help? Fill out the form below and we’ll get
          back to you as soon as we can.
        </p>

        {!submitted ? (
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
            </div>

            <Button
              variant="outline"
              type="submit"
              className="rounded-full px-6 hover:bg-gray-200 transition"
            >
              Send Message
            </Button>
          </form>
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
