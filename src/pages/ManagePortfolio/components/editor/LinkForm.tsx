
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { ExternalLink } from "@/types/portfolio";
import { detectLinkTypeFromUrl, getLinkIcon, validateAndFormatUrl } from "@/utils/linkUtils";

interface LinkFormProps {
  onAddLink: (link: ExternalLink) => void;
}

const LinkForm: React.FC<LinkFormProps> = ({ onAddLink }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkType, setLinkType] = useState<ExternalLink["type"]>("other");

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setLinkUrl(newUrl);
    if (newUrl.trim()) {
      setLinkType(detectLinkTypeFromUrl(newUrl));
    } else {
      setLinkType("other");
    }
  };

  const handleAddLink = () => {
    if (!linkUrl.trim()) return;

    const formattedUrl = validateAndFormatUrl(linkUrl);
    const detectedType = detectLinkTypeFromUrl(formattedUrl);
    
    const newLink: ExternalLink = {
      type: detectedType,
      url: formattedUrl,
      ...(detectedType === "other" && linkTitle ? { title: linkTitle } : {})
    };
    onAddLink(newLink);

    setLinkUrl("");
    setLinkTitle("");
    setLinkType("other");
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap md:flex-nowrap items-end gap-3">
        <div className="flex-grow w-full md:w-auto">
          <Label htmlFor="link-url">URL</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              {getLinkIcon(linkType)}
            </span>
            <Input
              id="link-url"
              placeholder="https://..."
              value={linkUrl}
              onChange={handleUrlChange}
              className="pl-10"
            />
          </div>
        </div>
        {linkType === "other" && (
          <div className="flex-grow w-full md:w-auto">
            <Label htmlFor="link-title">Link Label</Label>
            <Input
              id="link-title"
              placeholder="My Website"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />
          </div>
        )}
        <Button
          type="button"
          onClick={handleAddLink}
          className="bg-nature-forest hover:bg-nature-leaf h-10 shrink-0 w-full md:w-auto"
          disabled={!linkUrl.trim() || (linkType === "other" && !linkTitle.trim())}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add Link
        </Button>
      </div>
    </div>
  );
};

export default LinkForm;
