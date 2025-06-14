
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PortfolioGridEnhanced from "./enhanced/PortfolioGridEnhanced";

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-nature-forest mb-4">
            Featured Work
          </h2>
          <p className="text-xl text-nature-bark max-w-3xl mx-auto">
            Explore some of our most impactful audio engineering projects, showcasing the breadth of our expertise and creative approach.
          </p>
        </div>

        <PortfolioGridEnhanced showFeaturedOnly={true} limit={6} />

        <div className="text-center mt-16">
          <Link to="/portfolio">
            <Button 
              size="lg"
              className="bg-nature-forest hover:bg-nature-leaf text-white px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              View Full Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
