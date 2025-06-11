
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortfolioItem } from "@/data/portfolio";

const CATEGORIES = [
  "Mixing & Mastering", 
  "Sound Design", 
  "Podcasting", 
  "Sound for Picture", 
  "Dolby Atmos"
];

interface DetailsFormProps {
  formData: Omit<PortfolioItem, "id" | "createdAt">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCategoryChange: (value: string) => void;
  onFeaturedChange: (checked: boolean) => void;
}

const DetailsForm: React.FC<DetailsFormProps> = ({
  formData,
  onInputChange,
  onCategoryChange,
  onFeaturedChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input 
          id="title" 
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
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
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category *</Label>
        <Select 
          value={formData.category} 
          onValueChange={onCategoryChange}
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
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description" 
          name="description"
          value={formData.description}
          onChange={onInputChange}
          rows={4}
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="featured"
          checked={formData.featured}
          onCheckedChange={onFeaturedChange}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Feature this item in the portfolio
        </Label>
      </div>
    </div>
  );
};

export default DetailsForm;
