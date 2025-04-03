
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PortfolioItem } from "@/data/portfolio";

interface BasicInfoFormProps {
  currentItem: PortfolioItem;
  setCurrentItem: React.Dispatch<React.SetStateAction<PortfolioItem | null>>;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ currentItem, setCurrentItem }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={currentItem.title}
          onChange={(e) => setCurrentItem({...currentItem, title: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="client">Client</Label>
        <Input 
          id="client" 
          value={currentItem.client}
          onChange={(e) => setCurrentItem({...currentItem, client: e.target.value})}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={currentItem.description}
          onChange={(e) => setCurrentItem({...currentItem, description: e.target.value})}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Select 
          value={currentItem.category} 
          onValueChange={(value) => setCurrentItem({
            ...currentItem, 
            category: value as PortfolioItem['category']
          })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mixing & Mastering">Mixing & Mastering</SelectItem>
            <SelectItem value="Sound Design">Sound Design</SelectItem>
            <SelectItem value="Podcasting">Podcasting</SelectItem>
            <SelectItem value="Sound for Picture">Sound for Picture</SelectItem>
            <SelectItem value="Dolby Atmos">Dolby Atmos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicInfoForm;
