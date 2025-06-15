
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ExternalLink } from "@/types/portfolio";
import { getLinkIcon, getLinkLabel } from "@/utils/linkUtils";

interface LinksListProps {
  links: ExternalLink[];
  onRemoveLink: (index: number) => void;
}

const LinksList: React.FC<LinksListProps> = ({ links, onRemoveLink }) => {
  if (links.length === 0) {
    return (
      <div className="text-sm text-nature-bark italic p-4 bg-gray-50 rounded-md">
        No external links added yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-white">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              {getLinkIcon(link.type)}
            </div>
            <div>
              <div className="font-medium text-sm">
                {getLinkLabel(link)}
              </div>
              <div className="text-xs text-nature-bark truncate max-w-[250px]">
                {link.url}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveLink(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default LinksList;
