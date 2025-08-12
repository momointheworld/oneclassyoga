'use client';

import React, { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import parse from 'html-react-parser';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TipTapEditor from '@/components/TipTapEditor';
import { categoryOptions } from '@/lib/constants';

type ClientPostActionsProps = {
  postSlug: string;
  postId: number;
  initialTitle: string;
  initialContent: string;
  initialCategory?: string;
};

export default function ClientPostActions({
  postId,
  postSlug,
  initialTitle,
  initialContent,
  initialCategory = '',
}: ClientPostActionsProps) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset states when entering edit mode
  useEffect(() => {
    if (editing) {
      setTitle(initialTitle);
      setContent(initialContent);
      setCategory(initialCategory);
    }
  }, [editing, initialTitle, initialContent, initialCategory]);

  function CategorySelector() {
    return (
      <div className="flex flex-col space-y-2 mb-4">
        <h2 className="font-semibold">Category:</h2>
        <div className="grid grid-cols-2 gap-3">
          {categoryOptions.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="radio"
                name="category"
                value={cat}
                checked={category === cat}
                onChange={() => setCategory(cat)}
                className="cursor-pointer"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>
    );
  }

  async function handleUpdate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, category }),
      });

      if (!res.ok) throw new Error(await res.text());

      setEditing(false);

      router.push(`/community/${postSlug}`);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to update');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(await res.text());

      router.push('/community');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Failed to delete');
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          placeholder="Title"
          className="mb-4"
        />

        <CategorySelector />

        <TipTapEditor
          initialContent={content}
          onChange={(html: SetStateAction<string>) => setContent(html)}
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <Button
          variant="outline"
          onClick={handleUpdate}
          disabled={loading}
          className="mr-2 text-blue-700"
        >
          Save
        </Button>

        <Button
          variant="outline"
          onClick={() => setEditing(false)}
          disabled={loading}
        >
          Cancel
        </Button>
      </>
    );
  }

  // Show post view when not editing
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{initialTitle}</h1>
      <p className="mb-2 font-semibold">Category: {category || 'None'}</p>
      <div className="mb-8 tiptap prose max-w-none">
        {parse(initialContent)}
      </div>

      <Button
        variant="outline"
        onClick={() => setEditing(true)}
        className="mr-2 text-emerald-700"
      >
        Edit
      </Button>

      <Button
        variant="outline"
        className="text-orange-700"
        onClick={handleDelete}
        disabled={loading}
      >
        Delete
      </Button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </>
  );
}
