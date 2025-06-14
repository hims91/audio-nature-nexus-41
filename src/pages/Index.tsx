
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
        <meta name="description" content="Terra Echo Studios provides world-class audio engineering, mixing, mastering, sound design, and Dolby Atmos services. Transform your sound with our professional expertise and state-of-the-art equipment." />
        <meta name="keywords" content="audio engineering, mixing, mastering, sound design, recording studio, podcasting, dolby atmos, professional audio services, music production, post production audio" />
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

        {/* Enhanced SEO meta tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="Terra Echo Studios" />
        <meta name="theme-color" content="#22543D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Terra Echo Studios" />
        
        {/* Structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Terra Echo Studios",
            "description": "Professional audio engineering services including mixing, mastering, sound design, and Dolby Atmos",
            "url": "https://terraechostudios.com",
            "logo": "https://terraechostudios.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-XXX-XXX-XXXX",
              "contactType": "Customer Service",
              "email": "TerraEchoStudios@gmail.com"
            },
            "sameAs": [
              "https://www.facebook.com/terraechostudios",
              "https://www.instagram.com/terraechostudios",
              "https://www.linkedin.com/company/terraechostudios"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "serviceType": [
              "Audio Engineering",
              "Audio Mixing",
              "Audio Mastering", 
              "Sound Design",
              "Dolby Atmos",
              "Podcasting Services"
            ]
          })}
        </script>
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
