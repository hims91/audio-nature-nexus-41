
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
        <title>Portfolio | Terra Echo Studios - Professional Audio Engineering Work</title>
        <meta name="description" content="Explore Terra Echo Studios' comprehensive portfolio of professional audio engineering projects including mixing, mastering, sound design, Dolby Atmos work, and podcasting services. See our work across multiple industries and genres." />
        <meta name="keywords" content="audio portfolio, mixing examples, mastering samples, sound design work, dolby atmos projects, podcasting portfolio, audio engineering examples, professional audio work" />
        <link rel="canonical" href="https://terraechostudios.com/portfolio" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://terraechostudios.com/portfolio" />
        <meta property="og:title" content="Portfolio | Terra Echo Studios - Professional Audio Engineering Work" />
        <meta property="og:description" content="Explore our comprehensive portfolio of professional audio engineering projects across multiple industries and genres." />
        <meta property="og:image" content="https://terraechostudios.com/portfolio-og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://terraechostudios.com/portfolio" />
        <meta property="twitter:title" content="Portfolio | Terra Echo Studios - Professional Audio Engineering" />
        <meta property="twitter:description" content="Explore our professional audio engineering portfolio across multiple industries." />
        <meta property="twitter:image" content="https://terraechostudios.com/portfolio-og-image.jpg" />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="Terra Echo Studios" />
        <meta name="theme-color" content="#22543D" />
        
        {/* Structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Portfolio",
            "name": "Terra Echo Studios Portfolio",
            "description": "Professional audio engineering portfolio showcasing mixing, mastering, sound design, and Dolby Atmos work",
            "url": "https://terraechostudios.com/portfolio",
            "author": {
              "@type": "Organization",
              "name": "Terra Echo Studios",
              "url": "https://terraechostudios.com"
            },
            "industry": "Audio Engineering",
            "serviceType": ["Audio Mixing", "Audio Mastering", "Sound Design", "Dolby Atmos", "Podcasting"]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        
        {/* Hero Section with optimized structure */}
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
                
                {/* Enhanced hero content for better SEO */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nature-forest dark:text-nature-leaf">50+</div>
                    <div className="text-sm text-nature-bark dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nature-forest dark:text-nature-leaf">5</div>
                    <div className="text-sm text-nature-bark dark:text-gray-400">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nature-forest dark:text-nature-leaf">100%</div>
                    <div className="text-sm text-nature-bark dark:text-gray-400">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-nature-forest dark:text-nature-leaf">24/7</div>
                    <div className="text-sm text-nature-bark dark:text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Portfolio Grid with enhanced error handling */}
        <section className="py-16" aria-label="Portfolio Projects">
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
