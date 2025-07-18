'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TeacherBioEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
}

export default function TeacherBioEditor({
  initialContent = '',
  onChange,
}: TeacherBioEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false, // Prevents re-rendering on every keystroke
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !editor) return null;

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm bg-white">
      <MenuBar editor={editor} />
      <div className="border rounded p-3 min-h-[200px]">
        <EditorContent editor={editor} className="tiptap prose max-w-none" />
      </div>
    </div>
  );
}

function MenuBar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <div className="tiptap-menu flex flex-wrap gap-2 mb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`tiptap-menu-button ${
          editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`tiptap-menu-button ${
          editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`tiptap-menu-button ${
          editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
        }`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`tiptap-menu-button ${
          editor.isActive('bold') ? 'font-bold text-blue-600' : ''
        }`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`tiptap-menu-button ${
          editor.isActive('italic') ? 'italic text-blue-600' : ''
        }`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`tiptap-menu-button ${
          editor.isActive('strike') ? 'line-through text-blue-600' : ''
        }`}
      >
        Strike
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`tiptap-menu-button ${
          editor.isActive('bulletList') ? 'text-blue-600' : ''
        }`}
      >
        Toggle bullet list
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`tiptap-menu-button ${
          editor.isActive('orderedList') ? 'text-blue-600' : ''
        }`}
      >
        1. List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`tiptap-menu-button ${
          editor.isActive('paragraph') ? 'text-blue-600' : ''
        }`}
      >
        Paragraph
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`tiptap-menu-button ${
          editor.isActive('blockquote') ? 'is-active' : ''
        }`}
      >
        Toggle blockquote
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`tiptap-menu-button ${
          editor.isActive('codeBlock') ? 'is-active' : ''
        }`}
      >
        Toggle code block
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="tiptap-menu-button"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="tiptap-menu-button"
      >
        Redo
      </button>
    </div>
  );
}
