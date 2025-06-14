
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { ExternalLink } from "@/types/portfolio";
import { LINK_TYPES, validateAndFormatUrl } from "./linkUtils";

interface LinkFormProps {
  onAddLink: (link: ExternalLink) => void;
}

const LinkForm: React.FC<LinkFormProps> = ({ onAddLink }) => {
  const [linkType, setLinkType] = useState<ExternalLink["type"]>("spotify");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  
  const handleAddLink = () => {
    if (!linkUrl.trim()) return;
    
    const formattedUrl = validateAndFormatUrl(linkUrl);
    
    const newLink: ExternalLink = {
      type: linkType,
      url: formattedUrl,
      ...(linkType === "other" && linkTitle ? { title: linkTitle } : {})
    };
    
    onAddLink(newLink);
    
    // Reset form
    setLinkUrl("");
    setLinkTitle("");
  };
  
  return (
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
  );
};

export default LinkForm;
