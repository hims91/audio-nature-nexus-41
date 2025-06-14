
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGridEnhanced from "@/components/enhanced/PortfolioGridEnhanced";
import { Helmet } from "react-helmet-async";

const PortfolioPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio - Will Hall Sound Studios | Professional Audio Engineering</title>
        <meta name="description" content="Explore our portfolio of professional audio engineering projects including mixing, mastering, sound design, and Dolby Atmos work." />
        <meta name="keywords" content="audio portfolio, mixing examples, mastering samples, sound design, Dolby Atmos, professional audio" />
        <link rel="canonical" href={`${window.location.origin}/portfolio`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-white via-nature-mist/30 to-nature-sage/20">
        <Navbar />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-nature-forest mb-6">
                Our <span className="text-gradient">Portfolio</span>
              </h1>
              <p className="text-xl text-nature-bark max-w-3xl mx-auto mb-8">
                Discover the breadth and depth of our audio engineering expertise through our carefully curated collection of professional projects.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-nature-forest to-nature-leaf mx-auto"></div>
            </div>
          </section>

          {/* Featured Projects */}
          <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-nature-forest text-center mb-12">
                Featured Projects
              </h2>
              <PortfolioGridEnhanced showFeaturedOnly={true} />
            </div>
          </section>

          {/* All Projects */}
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-nature-forest text-center mb-12">
                All Projects
              </h2>
              <PortfolioGridEnhanced />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PortfolioPage;
