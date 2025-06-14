
import React from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import LiveEventWork from "@/components/LiveEventWork";
import Portfolio from "@/components/Portfolio";
import StatsCounter from "@/components/enhanced/StatsCounter";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PageTransition from "@/components/animations/PageTransition";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Will Hall Sound Studios | Professional Audio Engineering & Production</title>
        <meta name="description" content="Professional audio engineering services including mixing, mastering, sound design, podcasting, and Dolby Atmos. Authentic Audio, Naturally Engineered." />
        <meta name="keywords" content="audio engineering, mixing, mastering, sound design, podcasting, Dolby Atmos, professional audio, Will Hall" />
        <meta property="og:title" content="Will Hall Sound Studios | Professional Audio Engineering" />
        <meta property="og:description" content="Authentic Audio, Naturally Engineered. Professional mixing, mastering, and audio production services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.origin} />
        <link rel="canonical" href={window.location.origin} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Will Hall Sound Studios",
            "description": "Professional audio engineering services including mixing, mastering, sound design, and Dolby Atmos production",
            "url": window.location.origin,
            "telephone": "Contact via website",
            "email": "TerraEchoStudios@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Remote Services",
              "addressCountry": "US"
            },
            "serviceType": ["Audio Mixing", "Audio Mastering", "Sound Design", "Podcasting", "Dolby Atmos"],
            "areaServed": "Worldwide"
          })}
        </script>
      </Helmet>
      
      <PageTransition>
        <div className="min-h-screen">
          <Navbar />
          <Hero />
          <About />
          <Services />
          <LiveEventWork />
          <Portfolio />
          <StatsCounter />
          <Testimonials />
          <Contact />
          <Footer />
        </div>
      </PageTransition>
    </>
  );
};

export default Index;
