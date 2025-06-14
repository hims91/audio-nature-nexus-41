
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { type PortfolioItem } from "@/types/portfolio";
import LoadingSpinner from "../animations/LoadingSpinner";
import PortfolioFilters from "./PortfolioFilters";
import PortfolioCard from "./PortfolioCard";
import FadeInView from "../animations/FadeInView";

interface PortfolioGridEnhancedProps {
  showFeaturedOnly?: boolean;
  limit?: number;
}

const PortfolioGridEnhanced: React.FC<PortfolioGridEnhancedProps> = ({ 
  showFeaturedOnly = false, 
  limit 
}) => {
  const { portfolioItems, featuredItems, isLoading, error } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Set up real-time subscription for portfolio updates
  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for portfolio items...');
    
    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolio_items'
        },
        (payload) => {
          console.log('📡 Real-time update received:', payload);
          // React Query will automatically refresh data
        }
      )
      .subscribe();

    return () => {
      console.log('🔄 Cleaning up real-time subscription...');
      supabase.removeChannel(channel);
    };
  }, []);

  const items = showFeaturedOnly ? featuredItems : portfolioItems;
  const displayItems = limit ? items.slice(0, limit) : items;

  const categories = ["All", ...Array.from(new Set(portfolioItems.map(item => item.category)))];

  const filteredItems = selectedCategory === "All" 
    ? displayItems 
    : displayItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load portfolio items</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!showFeaturedOnly && (
        <PortfolioFilters 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, index) => (
          <FadeInView key={item.id} direction="up" delay={0.1 * index}>
            <PortfolioCard item={item} />
          </FadeInView>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-nature-bark dark:text-gray-300 text-lg">No projects found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default PortfolioGridEnhanced;
