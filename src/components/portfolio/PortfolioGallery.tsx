
import React from "react";
import { PortfolioItem } from "@/data/portfolio";
import PortfolioCard from "./PortfolioCard";

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  featured: boolean;
}

const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ items, featured }) => {
  return (
    <div className={`grid grid-cols-1 ${featured ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'} gap-6`}>
      {items.map((item) => (
        <PortfolioCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default PortfolioGallery;
