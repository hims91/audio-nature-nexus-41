
import React from "react";
import { Button } from "@/components/ui/button";
import { type PortfolioItem } from "@/types/portfolio";
import { getLinkIcon, getLinkLabel, validateAndFormatUrl } from "@/utils/linkUtils";

interface ExternalLinksProps {
  links: PortfolioItem['externalLinks'];
}

const ExternalLinks: React.FC<ExternalLinksProps> = ({ links }) => {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <div className="flex flex-wrap gap-1">
        {links.map((link, index) => (
          <a
            key={index}
            href={validateAndFormatUrl(link.url)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="group"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-xs cursor-pointer border-2 hover:border-blue-400 hover:bg-blue-50 dark:hover:border-blue-500 transition-all duration-200 transform group-hover:scale-105"
            >
              <span className="h-4 w-4 mr-1 flex items-center justify-center">{getLinkIcon(link.type)}</span>
              {getLinkLabel(link)}
            </Button>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ExternalLinks;
