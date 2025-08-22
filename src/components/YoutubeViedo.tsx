'use client';

import { useEffect, useState } from 'react';

interface YouTubeVideoProps {
  videoId: string;
  teacherName?: string;
  maxDescriptionLength?: number; // optional, default 200
}

interface VideoData {
  title: string;
  description: string;
}

// Truncate by full sentences without exceeding max length
function truncateBySentence(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  let result = '';

  for (const sentence of sentences) {
    if (result.length + sentence.length > maxLength) break;
    result += sentence + ' ';
  }

  return result.trim() + '…';
}

export default function YouTubeVideo({
  videoId,
  teacherName,
  maxDescriptionLength = 200,
}: YouTubeVideoProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );
        const data = await res.json();

        if (data.items && data.items.length > 0) {
          const snippet = data.items[0].snippet;
          const description = truncateBySentence(
            snippet.description || '',
            maxDescriptionLength
          );

          setVideoData({
            title: snippet.title,
            description,
          });
        }
      } catch (err) {
        console.error('Error fetching YouTube video:', err);
      }
    }

    fetchVideo();
  }, [videoId, maxDescriptionLength]);

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <section className="mt-6">
      <div className="aspect-[16/9]">
        <iframe
          src={embedUrl}
          title={videoData?.title || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md border"
        ></iframe>
      </div>
      {videoData && (
        <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
          {videoData.description}
        </p>
      )}
    </section>
  );
}
