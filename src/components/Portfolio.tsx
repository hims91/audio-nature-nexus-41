import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { portfolioItems as initialPortfolioItems } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Edit, Star, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import PortfolioGallery from "./portfolio/PortfolioGallery";
import PortfolioFilters from "./portfolio/PortfolioFilters";
import LZString from "lz-string";

const Portfolio: React.FC = () => {
  const [items, setItems] = useState(initialPortfolioItems);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState(items);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [storageInfo, setStorageInfo] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const compressedData = localStorage.getItem('compressedPortfolioItems');
      if (compressedData) {
        try {
          const decompressed = LZString.decompressFromUTF16(compressedData);
          if (decompressed) {
            console.log("📥 Portfolio component loading saved compressed items");
            const parsedItems = JSON.parse(decompressed);
            setItems(parsedItems);
            return;
          }
        } catch (decompressError) {
          console.error("❌ Error decompressing portfolio data:", decompressError);
        }
      }
      
      const savedItems = localStorage.getItem('portfolioItems');
      if (savedItems) {
        console.log("📥 Portfolio component loading saved legacy items");
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems);
      }
    } catch (error) {
      console.error("❌ Error loading portfolio items in Portfolio component:", error);
      toast({
        title: "Error Loading Portfolio",
        description: "There was an issue loading your portfolio data. Using default data instead.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  useEffect(() => {
    if (!activeCategory || activeCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, items]);

  const verifyLocalStorage = () => {
    try {
      const compressedData = localStorage.getItem('compressedPortfolioItems');
      
      let total = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key) || '';
          total += key.length + value.length;
        }
      }
      
      const sizeMB = (total * 2 / 1024 / 1024).toFixed(2);
      setStorageInfo(`${sizeMB}MB used`);
      
      if (compressedData) {
        try {
          const decompressed = LZString.decompressFromUTF16(compressedData);
          if (decompressed) {
            const parsedItems = JSON.parse(decompressed);
            console.log("✅ Verification successful: Found compressed items", parsedItems.length);
            toast({
              title: "Storage Verification Success",
              description: `Found ${parsedItems.length} items in compressed storage (${sizeMB}MB used).`,
            });
            setVerificationStatus('success');
            return;
          }
        } catch (error) {
          console.error("❌ Compressed data verification failed:", error);
        }
      }
      
      const savedItems = localStorage.getItem('portfolioItems');
      
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        console.log("✅ Verification successful: Found legacy items", parsedItems);
        toast({
          title: "Storage Verification Success",
          description: `Found ${parsedItems.length} items saved in legacy storage (${sizeMB}MB used).`,
        });
        setVerificationStatus('success');
      } else {
        console.warn("⚠️ No saved items found in localStorage");
        toast({
          title: "Storage Verification Warning",
          description: "No saved items found in localStorage.",
          variant: "destructive"
        });
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error("❌ Storage verification failed:", error);
      toast({
        title: "Storage Verification Failed",
        description: "There was an error checking localStorage.",
        variant: "destructive"
      });
      setVerificationStatus('error');
    }
    
    setTimeout(() => {
      setVerificationStatus('idle');
    }, 3000);
  };

  const categories = ["All", ...Array.from(new Set(items.map(item => item.category)))];
  
  return (
    <section id="portfolio" className="py-20 bg-nature-cream/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-nature-forest mb-4">Portfolio</h2>
          <p className="text-lg text-nature-bark max-w-3xl mx-auto">
            Explore my work across audio disciplines including Mixing & Mastering, Sound Design, 
            Podcasting, Sound for Picture, and Dolby Atmos
          </p>
          <div className="w-20 h-1 bg-nature-forest mx-auto mt-4"></div>
          
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link to="/manage-portfolio" className="inline-flex items-center text-nature-forest hover:text-nature-leaf transition-colors">
              <Edit className="mr-1 h-4 w-4" />
              Manage Portfolio
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={verifyLocalStorage}
              className={`text-xs ${
                verificationStatus === 'success' 
                  ? "bg-green-50 text-green-600 border-green-200" 
                  : verificationStatus === 'error'
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "text-nature-forest border-nature-forest"
              }`}
            >
              {verificationStatus === 'success' ? (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              ) : verificationStatus === 'error' ? (
                <AlertTriangle className="mr-1 h-3 w-3" />
              ) : (
                <Save className="mr-1 h-3 w-3" />
              )}
              Verify Storage
              {storageInfo && <span className="ml-1 text-xs opacity-70">{storageInfo}</span>}
            </Button>
          </div>
        </div>
        
        <PortfolioFilters 
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        
        {(!activeCategory || activeCategory === "All") && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-xl font-semibold text-nature-forest">Featured Work</h3>
            </div>
            <PortfolioGallery 
              items={filteredItems.filter(item => item.featured)}
              featured={true}
            />
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-nature-forest mb-6">
            {activeCategory && activeCategory !== "All" 
              ? activeCategory 
              : "All Projects"}
          </h3>
          
          {filteredItems.length > 0 ? (
            <PortfolioGallery 
              items={activeCategory && activeCategory !== "All" 
                ? filteredItems 
                : filteredItems.filter(item => !item.featured)}
              featured={false}
            />
          ) : (
            <div className="text-center py-16 bg-white/50 rounded-lg">
              <p className="text-lg text-nature-bark">No portfolio items found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
