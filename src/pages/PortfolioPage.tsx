
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import PortfolioGridEnhanced from '@/components/enhanced/PortfolioGridEnhanced';
import Footer from '@/components/Footer';
import FadeInView from '@/components/animations/FadeInView';

const PortfolioPage = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio | Terra Echo Studios - Our Audio Engineering Work</title>
        <meta name="description" content="Explore Terra Echo Studios' portfolio of professional audio engineering projects including mixing, mastering, sound design, and Dolby Atmos work." />
        <meta name="keywords" content="audio portfolio, mixing examples, mastering samples, sound design work, dolby atmos projects" />
        <link rel="canonical" href="https://terraechostudios.com/portfolio" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-nature-cream to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView direction="up" delay={0.2}>
              <div className="text-center">
                <h1 className="text-5xl font-bold text-nature-forest dark:text-white mb-6">
                  Our Portfolio
                </h1>
                <p className="text-xl text-nature-bark dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Discover the breadth of our audio engineering expertise through our diverse collection of projects. 
                  From intimate podcast recordings to cinematic soundscapes, each project showcases our commitment to sonic excellence.
                </p>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PortfolioGridEnhanced />
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default PortfolioPage;
