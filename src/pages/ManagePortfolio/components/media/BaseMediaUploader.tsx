
import React from "react";
import { getAcceptTypes, getTitle, getDescription, getTargetDirectory } from "./utils/mediaUtils";
import { useEnhancedFileHandler } from "./hooks/useEnhancedFileHandler";
import { DragDropUploader } from "./components/DragDropUploader";
import { EnhancedFileControls } from "./components/EnhancedFileControls";
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
    isUploading,
    uploadProgress,
    dragActive,
    handleFileChange,
    handleSaveFile,
    handleClearFile,
    handleReplaceFile,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop
  } = useEnhancedFileHandler({ type, file, setFile, toast });
  
  const title = getTitle(type);
  const description = getDescription(type);
  const acceptTypes = getAcceptTypes(type);
  const targetDirectory = getTargetDirectory(type);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-nature-forest mb-2">{title}</h3>
        <p className="text-sm text-nature-bark mb-4">{description}</p>
        
        <div className="space-y-4">
          <DragDropUploader
            type={type}
            acceptTypes={acceptTypes}
            dragActive={dragActive}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
            onFileChange={handleFileChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          
          {file && (
            <EnhancedFileControls
              fileName={fileName}
              isSaved={isSaved}
              isUploading={isUploading}
              targetDirectory={targetDirectory}
              onSave={handleSaveFile}
              onClear={handleClearFile}
              onReplace={handleReplaceFile}
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
