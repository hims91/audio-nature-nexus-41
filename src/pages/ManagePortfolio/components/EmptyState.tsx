
import React from "react";
import { Button } from "@/components/ui/button";
import { FileAudio, FileVideo, Image, PlusCircle } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center text-center h-[60vh]">
      <div className="flex gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-nature-forest/10 flex items-center justify-center">
          <FileAudio className="h-6 w-6 text-nature-forest" />
        </div>
        <div className="w-12 h-12 rounded-full bg-nature-forest/10 flex items-center justify-center">
          <FileVideo className="h-6 w-6 text-nature-forest" />
        </div>
        <div className="w-12 h-12 rounded-full bg-nature-forest/10 flex items-center justify-center">
          <Image className="h-6 w-6 text-nature-forest" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-nature-forest mb-3">
        Select an item or create a new one
      </h3>
      
      <p className="text-nature-bark max-w-md mb-6">
        Create portfolio items to showcase your audio and video work. 
        Add media files, external links, and categorize your projects.
      </p>
      
      <Button 
        onClick={onCreateNew}
        className="bg-nature-forest hover:bg-nature-leaf"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Item
      </Button>
    </div>
  );
};

export default EmptyState;
