import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { PortfolioFormData } from "./PortfolioFormData";

interface DetailsTabProps {
  formData: PortfolioFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onFeaturedChange: (checked: boolean) => void;
  onRecordedDateChange: (date: Date | undefined) => void;
  isLoading: boolean;
}

const CATEGORIES = [
  "Mixing & Mastering", 
  "Sound Design", 
  "Podcasting", 
  "Sound for Picture", 
  "Dolby Atmos"
];

const DetailsTab: React.FC<DetailsTabProps> = ({
  formData,
  onInputChange,
  onCategoryChange,
  onFeaturedChange,
  onRecordedDateChange,
  isLoading
}) => {
  const recordedDate = formData.recordedDate ? new Date(formData.recordedDate) : undefined;

  return (
    <div className="py-4 space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="client">Client *</Label>
        <Input 
          id="client" 
          name="client"
          value={formData.client}
          onChange={onInputChange}
          required
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={formData.category} 
          onValueChange={onCategoryChange}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="recorded-date">Completion Date</Label>
        <p className="text-xs text-muted-foreground mb-2">
          When was this project completed? (Optional)
        </p>
        <DatePicker
          date={recordedDate}
          onSelect={onRecordedDateChange}
          placeholder="Select completion date"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          name="description"
          value={formData.description}
          onChange={onInputChange}
          rows={4}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="featured"
          checked={formData.featured}
          onCheckedChange={onFeaturedChange}
          disabled={isLoading}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Feature this item in the portfolio
        </Label>
      </div>
    </div>
  );
};

export default DetailsTab;
