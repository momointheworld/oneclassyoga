'use client';

import React, { useState } from 'react';

type PostEditorProps = {
  post: { id: number; title: string; content: string };
  userId: string;
  onUpdated: () => void;
  onDeleted: () => void;
};

export default function PostEditor({
  post,
  userId,
  onUpdated,
  onDeleted,
}: PostEditorProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/posts/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, title, content, userId }),
      });
      if (!res.ok) throw new Error(await res.text());
      onUpdated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || 'Failed to update');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/posts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, userId }),
      });
      if (!res.ok) throw new Error(await res.text());
      onDeleted();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || 'Failed to update');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        className="border p-2 w-full mb-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        className="border p-2 w-full mb-2 h-40"
      />
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="mr-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Update
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
}
