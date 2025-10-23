'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import ImageResize from 'tiptap-extension-resize-image';

interface TipTapEditorProps {
  initialContent?: string;
  onChange: (html: string) => void;
  postId?: string; // optional for uploads
  maxWidth?: number; // optional client-side resize
  maxHeight?: number;
  uploadDisabled?: boolean;
}

export default function TipTapEditor({
  initialContent = '',
  onChange,
  postId,
  maxWidth = 800,
  maxHeight = 800,
  uploadDisabled = false,
}: TipTapEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: null,
          parseHTML: (element) => element.getAttribute('width'),
          renderHTML: (attributes) => {
            if (!attributes.width) return {};
            return { width: attributes.width };
          },
        },
        height: {
          default: null,
          parseHTML: (element) => element.getAttribute('height'),
          renderHTML: (attributes) => {
            if (!attributes.height) return {};
            return { height: attributes.height };
          },
        },
      };
    },
  });

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        CustomImage.configure({ inline: false, allowBase64: true }),
        ImageResize.configure({ preserveAspectRatio: true }),
        ResponsiveYoutube.configure({ controls: false, nocookie: true }),
      ],
      content: initialContent,
      onUpdate: ({ editor }) => onChange(editor.getHTML()),
      immediatelyRender: false, // ✅ important for SSR
    },
    [isMounted] // optional dependency to avoid creating editor before mounted
  );

  if (!isMounted || !editor) return null;

  /** Resize image client-side before upload */
  const resizeImage = (
    file: File
  ): Promise<{ blob: Blob; width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) return reject('Failed to create blob');
          resolve({ blob, width, height });
        }, file.type);
      };
      img.onerror = reject;
    });
  };

  /** Upload image to Supabase */
  const uploadImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !editor) return;

      try {
        const { blob, width, height } = await resizeImage(file);
        const formData = new FormData();
        formData.append('file', blob, file.name);
        if (postId) formData.append('postId', postId);

        const res = await fetch('/api/upload-post-image', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        if (data.url) {
          // Insert image with width & height attributes
          editor
            .chain()
            .focus()
            .setImage({
              src: data.url,
              width,
              height,
            })
            .run();
        } else {
          alert('Image upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    };

    input.click();
  };

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm bg-white">
      <MenuBar
        editor={editor}
        onUploadImage={uploadImage}
        uploadDisabled={uploadDisabled}
      />
      <div className="border rounded p-3 min-h-[200px]">
        <EditorContent editor={editor} className="tiptap prose max-w-none" />
      </div>
    </div>
  );
}

const ResponsiveYoutube = Youtube.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: 640 },
      height: { default: 360 },
    };
  },

  renderHTML({ node }) {
    const width = node.attrs.width || 640;
    const height = node.attrs.height || 360;
    const ratio = (height / width) * 100;

    return [
      'div',
      {
        style: `position: relative; padding-bottom: ${ratio}%; height: 0; overflow: hidden;`,
      },
      [
        'iframe',
        {
          src: node.attrs.src,
          frameborder: 0,
          allowfullscreen: 'true',
          style:
            'position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
        },
      ],
    ];
  },
});
interface MenuBarProps {
  editor: Editor;
  onUploadImage: () => void;
  uploadDisabled: boolean;
}

export function MenuBar({
  editor,
  onUploadImage,
  uploadDisabled,
}: MenuBarProps) {
  const [videoWidth, setVideoWidth] = useState('640');
  const [videoHeight, setVideoHeight] = useState('360');

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube URL');
    if (!url) return;

    // Extract the 11-character YouTube video ID from any URL type
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/
    );

    if (!match) return alert('Invalid YouTube URL');

    const videoId = match[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const width = Math.max(320, parseInt(videoWidth, 10) || 640);
    const height = Math.max(
      180,
      parseInt(videoHeight, 10) || Math.floor((width * 9) / 16)
    );

    editor.commands.setYoutubeVideo({
      src: embedUrl,
      width,
      height,
    });
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value;
    setVideoWidth(newWidth);

    // Auto-calc height to preserve 16:9
    setVideoHeight(
      Math.floor(((parseInt(newWidth) || 640) * 9) / 16).toString()
    );
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value;
    setVideoHeight(newHeight);

    // Auto-calc width to preserve 16:9
    setVideoWidth(
      Math.floor(((parseInt(newHeight) || 360) * 16) / 9).toString()
    );
  };

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
      <button
        type="button"
        disabled={uploadDisabled}
        onClick={onUploadImage}
        className="tiptap-menu-button text-blue-500"
      >
        📷 Upload Image
      </button>
      {/* YouTube Inputs */}
      <input
        type="number"
        min="320"
        max="1920"
        value={videoWidth}
        onChange={handleWidthChange}
        placeholder="Width"
        className="tiptap-input"
      />
      <input
        type="number"
        min="180"
        max="1080"
        value={videoHeight}
        onChange={handleHeightChange}
        placeholder="Height"
        className="tiptap-input"
      />
      <button
        type="button"
        onClick={addYoutubeVideo}
        className="tiptap-menu-button text-orange-500"
      >
        Add YouTube Video
      </button>
    </div>
  );
}
