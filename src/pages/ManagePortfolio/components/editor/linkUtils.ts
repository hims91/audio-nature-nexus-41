
import { 
  Music2, 
  Youtube, 
  Video, 
  Link2
} from "lucide-react";
import { ExternalLink } from "@/types/portfolio";

export const LINK_TYPES = [
  { value: "spotify", label: "Spotify" },
  { value: "appleMusic", label: "Apple Music" },
  { value: "youtube", label: "YouTube" },
  { value: "vimeo", label: "Vimeo" },
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
    case "other":
      return link.title || "External Link";
  }
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
