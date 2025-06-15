
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";
import MagneticButton from "../animations/MagneticButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExternalLinksSectionProps {
  links: PortfolioItem['externalLinks'];
  onLinkClick: (url: string, title: string) => void;
}

const ExternalLinksSection: React.FC<ExternalLinksSectionProps> = ({ links, onLinkClick }) => {
  const isMobile = useIsMobile();

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {links.map((link, index) => (
        <MagneticButton key={index}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLinkClick(link.url, link.title || link.type)}
            className={`text-xs transform hover:scale-105 transition-all duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 ${
              isMobile ? 'px-4 py-3 text-sm' : ''
            }`}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            {link.title || link.type}
          </Button>
        </MagneticButton>
      ))}
    </div>
  );
};

export default ExternalLinksSection;
