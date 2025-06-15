
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { type PortfolioItem } from "@/types/portfolio";

interface ExternalLinksProps {
  links: PortfolioItem['externalLinks'];
}

const ExternalLinks: React.FC<ExternalLinksProps> = ({ links }) => {
  const handleExternalLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔗 Opening external link:', url);
    try {
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(validUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('❌ Error opening external link:', error);
    }
  };

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <div className="flex flex-wrap gap-1">
        {links.map((link, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={(e) => handleExternalLinkClick(link.url, e)}
            className="text-xs cursor-pointer border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {link.title || link.type}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExternalLinks;
