
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAcceptTypes, getTitle, getDescription, getTargetDirectory } from "./utils/mediaUtils";
import { useFileHandler } from "./hooks/useFileHandler";
import { FileControls } from "./components/FileControls";
import { FileStatusDisplay } from "./components/FileStatusDisplay";

export interface BaseMediaUploaderProps {
  type: "image" | "audio" | "video";
  currentUrl?: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  toast: any;
  children?: React.ReactNode;
}

export const BaseMediaUploader: React.FC<BaseMediaUploaderProps> = ({
  type,
  file,
  setFile,
  toast,
  children
}) => {
  const {
    fileName,
    isSaved,
    handleFileChange,
    handleSaveFile,
    handleClearFile
  } = useFileHandler({ type, file, setFile, toast });
  
  const title = getTitle(type);
  const description = getDescription(type);
  const acceptTypes = getAcceptTypes(type);
  const targetDirectory = getTargetDirectory(type);
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-2">{title}</h3>
        <p className="text-sm text-nature-bark mb-4">{description}</p>
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor={`${type}-upload`}>Select {title}</Label>
          <Input
            id={`${type}-upload`}
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          
          {file && (
            <FileControls
              fileName={fileName}
              isSaved={isSaved}
              targetDirectory={targetDirectory}
              onSave={handleSaveFile}
              onClear={handleClearFile}
            />
          )}
          
          <FileStatusDisplay
            isSaved={isSaved}
            targetDirectory={targetDirectory}
          />
        </div>
      </div>
      
      {children}
    </div>
  );
};
