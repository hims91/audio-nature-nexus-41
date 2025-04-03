
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DetailsTabProps {
  title: string;
  client: string;
  category: string;
  description: string;
  featured: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCategoryChange: (value: string) => void;
  handleFeaturedChange: (checked: boolean) => void;
}

const CATEGORIES = [
  "Mixing & Mastering", 
  "Sound Design", 
  "Podcasting", 
  "Sound for Picture", 
  "Dolby Atmos"
];

const DetailsTab: React.FC<DetailsTabProps> = ({
  title,
  client,
  category,
  description,
  featured,
  handleInputChange,
  handleCategoryChange,
  handleFeaturedChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          name="title"
          value={title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="client">Client *</Label>
        <Input 
          id="client" 
          name="client"
          value={client}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={category} 
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(categoryOption => (
              <SelectItem key={categoryOption} value={categoryOption}>
                {categoryOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          name="description"
          value={description}
          onChange={handleInputChange}
          rows={4}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="featured"
          checked={featured}
          onCheckedChange={handleFeaturedChange}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Feature this item in the portfolio
        </Label>
      </div>
    </div>
  );
};

export default DetailsTab;
