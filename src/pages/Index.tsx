
import React from 'react';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Hero from '@/components/Hero';
import AboutEnhanced from '@/components/enhanced/AboutEnhanced';
import ServicesEnhanced from '@/components/enhanced/ServicesEnhanced';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import ContactFormEnhanced from '@/components/enhanced/ContactFormEnhanced';
import Footer from '@/components/Footer';
import SEOManager from '@/components/SEO/SEOManager';
import PWAInstallerEnhanced from '@/components/performance/PWAInstallerEnhanced';

const Index = () => {
  return (
    <>
      <SEOManager
        title="Terra Echo Studios | Professional Audio Engineering Services"
        description="Terra Echo Studios provides world-class audio engineering, mixing, mastering, sound design, and Dolby Atmos services. Transform your sound with our professional expertise and state-of-the-art equipment."
        keywords={[
          "audio engineering",
          "mixing", 
          "mastering",
          "sound design",
          "recording studio",
          "podcasting",
          "dolby atmos",
          "professional audio services",
          "music production",
          "post production audio",
          "terra echo studios"
        ]}
        structuredDataType="organization"
        structuredData={{
          name: "Terra Echo Studios",
          telephone: "+1 (555) 123-4567",
          email: "TerraEchoStudios@gmail.com",
          address: "Los Angeles, CA",
          sameAs: [
            "https://www.facebook.com/terraechostudios",
            "https://www.instagram.com/terraechostudios",
            "https://www.linkedin.com/company/terraechostudios"
          ]
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <UnifiedNavbar />
        
        <main>
          <Hero />
          <div id="about">
            <AboutEnhanced />
          </div>
          <div id="services">
            <ServicesEnhanced />
          </div>
          <div id="portfolio">
            <Portfolio />
          </div>
          <div id="testimonials">
            <Testimonials />
          </div>
          <div id="contact">
            <ContactFormEnhanced />
          </div>
        </main>
        
        <Footer />
        <PWAInstallerEnhanced />
      </div>
    </>
  );
};

export default Index;
