'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewTeacherForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    bio: '',
    styles: '',
    rate: '',
    photo: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/admin/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        styles: form.styles.split(',').map((s) => s.trim()),
        rate: parseFloat(form.rate),
      }),
    });

    if (res.ok) router.push('/admin');
    else alert('Failed to add teacher');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl mb-4">Add New Teacher</h2>
      <label className="block mb-2">
        Name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>
      <label className="block mb-2">
        Bio
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>
      <label className="block mb-2">
        Styles (comma separated)
        <input
          value={form.styles}
          onChange={(e) => setForm({ ...form, styles: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>
      <label className="block mb-2">
        Rate (THB)
        <input
          required
          type="number"
          value={form.rate}
          onChange={(e) => setForm({ ...form, rate: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>
      <label className="block mb-6">
        Photo URL
        <input
          value={form.photo}
          onChange={(e) => setForm({ ...form, photo: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </label>
      <button type="submit" className="btn-primary">
        Add Teacher
      </button>
    </form>
  );
}
