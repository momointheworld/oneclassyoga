'use client';

import { useEffect, useState } from 'react';

interface YouTubeVideoProps {
  youtubeId: string;
  bilibiliId?: string;
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
  youtubeId,
  bilibiliId,
  maxDescriptionLength = 200,
}: YouTubeVideoProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [isChina, setIsChina] = useState(false);

  useEffect(() => {
    // 🌍 Detect location
    async function detectLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country_code === 'CN') {
          setIsChina(true);
        }
        // setIsChina(true); // For testing outside China
      } catch (err) {
        console.error('Location detection failed:', err);
      }
    }

    detectLocation();
  }, []);

  useEffect(() => {
    async function fetchVideo() {
      if (isChina) return; // skip fetching YouTube data

      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
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
  }, [youtubeId, maxDescriptionLength, isChina]);

  const embedUrl = isChina
    ? `https://player.bilibili.com/player.html?bvid=${bilibiliId}&page=1`
    : `https://www.youtube.com/embed/${youtubeId}`;

  return (
    <section className="mt-6">
      <div className="aspect-[16/9]">
        <iframe
          src={embedUrl}
          title={videoData?.title || 'Video Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-md border"
        ></iframe>
      </div>
    </section>
  );
}
