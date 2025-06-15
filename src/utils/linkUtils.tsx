
import { 
  Music2, 
  Youtube, 
  Video, 
  Link2,
  Facebook,
  Twitter,
  Instagram
} from "lucide-react";
import { ExternalLink } from "@/types/portfolio";

export const LINK_TYPES = [
  { value: "spotify", label: "Spotify" },
  { value: "appleMusic", label: "Apple Music" },
  { value: "youtube", label: "YouTube" },
  { value: "vimeo", label: "Vimeo" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "bandcamp", label: "Bandcamp" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other Website" }
];

export const getLinkIcon = (type: ExternalLink["type"]) => {
  switch (type) {
    case "spotify":
      return <Music2 className="h-4 w-4 text-[#1DB954]" />;
    case "appleMusic":
      return <Music2 className="h-4 w-4 text-[#FB233B]" />;
    case "youtube":
      return <Youtube className="h-4 w-4 text-[#FF0000]" />;
    case "vimeo":
      return <Video className="h-4 w-4 text-[#1AB7EA]" />;
    case "soundcloud":
      return <Music2 className="h-4 w-4 text-[#FF5500]" />;
    case "bandcamp":
      return <Music2 className="h-4 w-4 text-[#629AA9]" />;
    case "facebook":
      return <Facebook className="h-4 w-4 text-[#1877F2]" />;
    case "twitter":
      return <Twitter className="h-4 w-4 text-[#1DA1F2]" />;
    case "instagram":
      return <Instagram className="h-4 w-4 text-[#E4405F]" />;
    default:
      return <Link2 className="h-4 w-4 text-nature-forest" />;
  }
};

export const getLinkLabel = (link: ExternalLink) => {
  switch (link.type) {
    case "spotify":
      return "Spotify";
    case "appleMusic":
      return "Apple Music";
    case "youtube":
      return "YouTube";
    case "vimeo":
      return "Vimeo";
    case "soundcloud":
      return "SoundCloud";
    case "bandcamp":
      return "Bandcamp";
    case "facebook":
      return "Facebook";
    case "twitter":
      return "X (Twitter)";
    case "instagram":
      return "Instagram";
    case "other":
      return link.title || "External Link";
  }
};

export const detectLinkTypeFromUrl = (url: string): ExternalLink['type'] => {
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('music.apple.com')) return 'appleMusic';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('soundcloud.com')) return 'soundcloud';
  if (url.includes('bandcamp.com')) return 'bandcamp';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('instagram.com')) return 'instagram';
  return 'other';
};

export const validateAndFormatUrl = (url: string): string => {
  if (!url.trim()) return url;
  
  try {
    new URL(url);
    return url;
  } catch (e) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }
};
