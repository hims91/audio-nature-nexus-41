
import React, { useState } from "react";
import { ExternalLink } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Music2, 
  Youtube, 
  Video, 
  Link2, 
  PlusCircle, 
  Trash2,
  ExternalLink as ExternalLinkIcon
} from "lucide-react";

interface ExternalLinksEditorProps {
  links: ExternalLink[];
  onAddLink: (link: ExternalLink) => void;
  onRemoveLink: (index: number) => void;
}

const LINK_TYPES = [
  { value: "spotify", label: "Spotify" },
  { value: "appleMusic", label: "Apple Music" },
  { value: "youtube", label: "YouTube" },
  { value: "vimeo", label: "Vimeo" },
  { value: "other", label: "Other Website" }
];

const ExternalLinksEditor: React.FC<ExternalLinksEditorProps> = ({ 
  links, 
  onAddLink, 
  onRemoveLink 
}) => {
  const [linkType, setLinkType] = useState<ExternalLink["type"]>("spotify");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  
  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    
    // Validate URL format
    try {
      new URL(linkUrl);
    } catch (e) {
      // Not a valid URL, prepend with https:// if no protocol
      if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
        setLinkUrl(`https://${linkUrl}`);
        return;
      }
    }
    
    const newLink: ExternalLink = {
      type: linkType,
      url: linkUrl,
      ...(linkType === "other" && linkTitle ? { title: linkTitle } : {})
    };
    
    onAddLink(newLink);
    
    // Reset form
    setLinkUrl("");
    setLinkTitle("");
  };
  
  // Helper function to get icon based on link type
  const getLinkIcon = (type: ExternalLink["type"]) => {
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
  
  // Helper function to get link label
  const getLinkLabel = (link: ExternalLink) => {
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
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-4">External Links</h3>
        <p className="text-sm text-nature-bark mb-4">
          Add links to Spotify, Apple Music, YouTube, Vimeo, or any other website where this work can be found.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <Label htmlFor="link-type">Platform</Label>
            <Select 
              value={linkType} 
              onValueChange={(value) => setLinkType(value as ExternalLink["type"])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                {LINK_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col">
            {linkType === "other" ? (
              <>
                <Label htmlFor="link-title">Link Label</Label>
                <Input
                  id="link-title"
                  placeholder="My Website"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                />
              </>
            ) : (
              <>
                <Label>&nbsp;</Label>
                <Button 
                  onClick={handleAddLink}
                  className="bg-nature-forest hover:bg-nature-leaf h-10"
                  disabled={!linkUrl.trim()}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Link
                </Button>
              </>
            )}
          </div>
          
          {linkType === "other" && (
            <div className="md:col-span-3">
              <Button 
                onClick={handleAddLink}
                className="bg-nature-forest hover:bg-nature-leaf"
                disabled={!linkUrl.trim()}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Custom Link
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-nature-forest mb-2">Added Links</h4>
        
        {links.length === 0 ? (
          <div className="text-sm text-nature-bark italic p-4 bg-gray-50 rounded-md">
            No external links added yet
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ExternalLinksEditor;
