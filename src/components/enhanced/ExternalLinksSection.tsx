
import React from "react";
import { Button } from "@/components/ui/button";
import { type PortfolioItem } from "@/types/portfolio";
import { useIsMobile } from "@/hooks/use-mobile";
import { getLinkIcon, getLinkLabel, validateAndFormatUrl } from "@/utils/linkUtils";

interface ExternalLinksSectionProps {
  links: PortfolioItem['externalLinks'];
}

const ExternalLinksSection: React.FC<ExternalLinksSectionProps> = ({ links }) => {
  const isMobile = useIsMobile();

  if (!links || links.length === 0) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(validateAndFormatUrl(url), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {links.map((link, index) => (
        <Button
          key={index}
          onClick={(e) => handleLinkClick(e, link.url)}
          variant="outline"
          size="sm"
          className={`text-xs transform hover:scale-105 transition-all duration-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 ${
            isMobile ? 'px-4 py-3 text-sm' : ''
          }`}
        >
          <span className="w-3 h-3 mr-1 flex items-center justify-center">{getLinkIcon(link.type)}</span>
          {getLinkLabel(link)}
        </Button>
      ))}
    </div>
  );
};

export default ExternalLinksSection;
