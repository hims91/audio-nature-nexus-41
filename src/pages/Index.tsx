
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import InteractiveHeroEnhanced from '@/components/enhanced/InteractiveHeroEnhanced';
import AboutEnhanced from '@/components/enhanced/AboutEnhanced';
import ServicesEnhanced from '@/components/enhanced/ServicesEnhanced';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import ContactFormEnhanced from '@/components/enhanced/ContactFormEnhanced';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Terra Echo Studios | Professional Audio Engineering Services</title>
        <meta name="description" content="Terra Echo Studios provides world-class audio engineering, mixing, mastering, and sound design services. Transform your sound with our professional expertise." />
        <meta name="keywords" content="audio engineering, mixing, mastering, sound design, recording studio, podcasting, dolby atmos" />
        <link rel="canonical" href="https://terraechostudios.com" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://terraechostudios.com/" />
        <meta property="og:title" content="Terra Echo Studios | Professional Audio Engineering Services" />
        <meta property="og:description" content="Transform your sound with our professional audio engineering, mixing, mastering, and sound design services." />
        <meta property="og:image" content="https://terraechostudios.com/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://terraechostudios.com/" />
        <meta property="twitter:title" content="Terra Echo Studios | Professional Audio Engineering" />
        <meta property="twitter:description" content="Transform your sound with our professional audio engineering services." />
        <meta property="twitter:image" content="https://terraechostudios.com/og-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <UnifiedNavbar />
        
        <main>
          <InteractiveHeroEnhanced />
          <AboutEnhanced />
          <ServicesEnhanced />
          <Portfolio />
          <Testimonials />
          <ContactFormEnhanced />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
