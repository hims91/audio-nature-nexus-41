
import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Upload, 
  HardDrive, 
  AlertTriangle, 
  Trash2
} from "lucide-react";

interface DataManagementProps {
  storageUsage: string;
  exportData: () => boolean;
  importData: (jsonData: string) => boolean;
  clearStorage: () => boolean;
}

const DataManagement: React.FC<DataManagementProps> = ({
  storageUsage,
  exportData,
  importData,
  clearStorage
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    
    // Read the file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = importData(content);
        
        if (success) {
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      } catch (error) {
        console.error("❌ Error reading import file:", error);
        toast({
          title: "Import Error",
          description: "Could not read the selected file.",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Import Error",
        description: "Failed to read the file.",
        variant: "destructive"
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  const handleClearStorage = () => {
    if (window.confirm("Are you sure you want to clear all portfolio data from browser storage? This cannot be undone unless you have an export file.")) {
      clearStorage();
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Storage Management</CardTitle>
        <CardDescription>
          Manage your portfolio data and browser storage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 py-3 bg-slate-50 rounded-md">
            <div className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium">Storage Usage</span>
            </div>
            <div className="text-sm">
              <span className={`font-mono ${parseFloat(storageUsage) > 4.5 ? 'text-amber-600' : 'text-slate-600'}`}>
                {storageUsage} MB
              </span>
              {parseFloat(storageUsage) > 4.5 && (
                <div className="text-xs text-amber-600 flex items-center mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Approaching limit
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={exportData}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import Data'}
            </Button>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full text-red-500 border-red-200 hover:border-red-300 hover:bg-red-50"
              onClick={handleClearStorage}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Browser Storage
            </Button>
          </div>
          
          <div className="text-xs text-slate-500 pt-1">
            <p>If you're experiencing storage issues, try these steps:</p>
            <ol className="list-decimal list-inside pl-2 pt-1 space-y-1">
              <li>Export your data as a backup</li>
              <li>Clear browser storage</li>
              <li>Import your data from the backup file</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataManagement;
