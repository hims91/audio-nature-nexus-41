import React from "react";
import { Helmet } from "react-helmet-async";
import ModernNavbarEnhanced from "@/components/enhanced/ModernNavbarEnhanced";
import InteractiveHeroEnhanced from "@/components/enhanced/InteractiveHeroEnhanced";
import About from "@/components/About";
import Services from "@/components/Services";
import LiveEventWork from "@/components/LiveEventWork";
import Portfolio from "@/components/Portfolio";
import StatsCounter from "@/components/enhanced/StatsCounter";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageTransition from "@/components/animations/PageTransition";
import StructuredData from "@/components/SEO/StructuredData";
import SocialMeta from "@/components/SEO/SocialMeta";
import PWAInstaller from "@/components/performance/PWAInstaller";
import SitemapGenerator from "@/components/SEO/SitemapGenerator";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Terra Echo Studios | Professional Audio Engineering & Production</title>
        <meta name="description" content="Professional audio engineering services including mixing, mastering, sound design, podcasting, and Dolby Atmos. Authentic Audio, Naturally Engineered." />
        <meta name="keywords" content="audio engineering, mixing, mastering, sound design, podcasting, Dolby Atmos, professional audio, Terra Echo Studios" />
        <link rel="canonical" href={window.location.origin} />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#065f46" />
      </Helmet>

      <StructuredData type="website" />
      <StructuredData type="organization" />
      
      <SocialMeta
        title="Terra Echo Studios | Professional Audio Engineering"
        description="Authentic Audio, Naturally Engineered. Professional mixing, mastering, and audio production services."
        url={window.location.origin}
      />

      <SitemapGenerator />
      
      <PageTransition>
        <div className="min-h-screen transition-colors duration-500">
          <ModernNavbarEnhanced />
          <InteractiveHeroEnhanced />
          <About />
          <Services />
          <LiveEventWork />
          <Portfolio />
          <StatsCounter />
          <Testimonials />
          <Contact />
          <Footer />
          <PWAInstaller />
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
