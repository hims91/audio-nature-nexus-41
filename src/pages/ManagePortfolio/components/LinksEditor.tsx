
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, LinkIcon, Music } from "lucide-react";
import { PortfolioItem } from "@/data/portfolio";

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
  const iconOptions = [
    { value: "link", label: "Generic Link" },
    { value: "youtube", label: "YouTube" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" }
  ];
  
  const getIconComponent = (icon: string) => {
    switch(icon) {
      case 'youtube': return <Music className="h-4 w-4 text-white" />;
      case 'instagram': return <Music className="h-4 w-4 text-white" />;
      case 'facebook': return <Music className="h-4 w-4 text-white" />;
      case 'twitter': return <Music className="h-4 w-4 text-white" />;
      case 'linkedin': return <Music className="h-4 w-4 text-white" />;
      default: return <LinkIcon className="h-4 w-4 text-white" />;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="spotifyUrl">Spotify Link</Label>
        <Input 
          id="spotifyUrl" 
          placeholder="https://open.spotify.com/..."
          value={currentItem.spotifyUrl || ""}
          onChange={(e) => setCurrentItem({...currentItem, spotifyUrl: e.target.value})}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Add a link to the Spotify album, track, or playlist
        </p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Other Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
          <Input 
            placeholder="Link title" 
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
                <SelectValue placeholder="Icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map(option => (
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
        
        {currentItem.otherLinks && currentItem.otherLinks.length > 0 ? (
          <div className="space-y-2">
            {currentItem.otherLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between border p-2 rounded">
                <div className="flex items-center">
                  <div className="bg-nature-stone p-1 rounded mr-2">
                    {getIconComponent(link.icon)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{link.title}</p>
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
          <p className="text-sm text-muted-foreground italic">No additional links added yet</p>
        )}
      </div>
    </div>
  );
};
