
import React from 'react';
import { ExternalLink } from '@/types/portfolio';

interface EmbedPreviewProps {
  link: ExternalLink;
}

const getYoutubeVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const EmbedPreview: React.FC<EmbedPreviewProps> = ({ link }) => {
  if (link.type === 'youtube') {
    const videoId = getYoutubeVideoId(link.url);
    if (videoId) {
      return (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-nature-forest mb-2">YouTube Preview</h4>
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      );
    }
  }

  // Add more embed types here for Facebook, etc. in the future.

  return null;
};

export default EmbedPreview;
