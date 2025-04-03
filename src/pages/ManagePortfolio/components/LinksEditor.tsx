
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, LinkIcon, Music } from "lucide-react";
import { PortfolioItem, ExternalLink } from "@/data/portfolio";

interface LinksEditorProps {
  currentItem: PortfolioItem;
  setCurrentItem: React.Dispatch<React.SetStateAction<PortfolioItem | null>>;
  newLinkTitle: string;
  setNewLinkTitle: React.Dispatch<React.SetStateAction<string>>;
  newLinkUrl: string;
  setNewLinkUrl: React.Dispatch<React.SetStateAction<string>>;
  newLinkIcon: string;
  setNewLinkIcon: React.Dispatch<React.SetStateAction<string>>;
  onAddLink: () => void;
  onRemoveLink: (index: number) => void;
}

export const LinksEditor: React.FC<LinksEditorProps> = ({
  currentItem,
  setCurrentItem,
  newLinkTitle,
  setNewLinkTitle,
  newLinkUrl,
  setNewLinkUrl,
  newLinkIcon,
  setNewLinkIcon,
  onAddLink,
  onRemoveLink
}) => {
  const linkTypeOptions = [
    { value: "spotify", label: "Spotify" },
    { value: "appleMusic", label: "Apple Music" },
    { value: "youtube", label: "YouTube" },
    { value: "vimeo", label: "Vimeo" },
    { value: "other", label: "Other Link" }
  ];
  
  const getIconComponent = (type: string) => {
    // For simplicity, we'll use the Music icon for all types
    // In a real app, you'd have different icons for different types
    return <Music className="h-4 w-4 text-white" />;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">External Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <Input 
            placeholder="Link title (for 'Other' type)" 
            value={newLinkTitle}
            onChange={(e) => setNewLinkTitle(e.target.value)}
          />
          <Input 
            placeholder="URL (https://...)" 
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
          />
          <div className="flex gap-2">
            <Select 
              value={newLinkIcon} 
              onValueChange={setNewLinkIcon}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Link Type" />
              </SelectTrigger>
              <SelectContent>
                {linkTypeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button" 
              size="icon" 
              onClick={onAddLink}
              className="bg-nature-forest hover:bg-nature-leaf"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {currentItem.externalLinks && currentItem.externalLinks.length > 0 ? (
          <div className="space-y-2">
            {currentItem.externalLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between border p-2 rounded">
                <div className="flex items-center">
                  <div className="bg-nature-stone p-1 rounded mr-2">
                    {getIconComponent(link.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{link.type === 'other' ? link.title : link.type}</p>
                    <p className="text-xs text-nature-bark truncate">{link.url}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">No external links added yet</p>
        )}
      </div>
    </div>
  );
};
