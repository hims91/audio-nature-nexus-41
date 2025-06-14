
import React from "react";
import { ExternalLink } from "@/types/portfolio";
import LinkForm from "./editor/LinkForm";
import LinksList from "./editor/LinksList";

interface ExternalLinksEditorProps {
  links: ExternalLink[];
  onAddLink: (link: ExternalLink) => void;
  onRemoveLink: (index: number) => void;
}

const ExternalLinksEditor: React.FC<ExternalLinksEditorProps> = ({ 
  links, 
  onAddLink, 
  onRemoveLink 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-4">External Links</h3>
        <p className="text-sm text-nature-bark mb-4">
          Add links to Spotify, Apple Music, YouTube, Vimeo, or any other website where this work can be found.
        </p>
        
        <LinkForm onAddLink={onAddLink} />
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-nature-forest mb-2">Added Links</h4>
        <LinksList links={links} onRemoveLink={onRemoveLink} />
      </div>
    </div>
  );
};

export default ExternalLinksEditor;
