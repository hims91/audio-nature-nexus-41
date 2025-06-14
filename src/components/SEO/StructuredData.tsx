
import React from "react";
import { Helmet } from "react-helmet-async";

interface StructuredDataProps {
  type: "website" | "organization" | "service" | "portfolio";
  data?: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data = {} }) => {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case "website":
        return {
          ...baseData,
          "@type": "WebSite",
          "name": "Will Hall Sound Studios",
          "description": "Professional audio engineering services including mixing, mastering, sound design, and Dolby Atmos production",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/portfolio?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          ...data
        };

      case "organization":
        return {
          ...baseData,
          "@type": "ProfessionalService",
          "name": "Will Hall Sound Studios",
          "description": "Professional audio engineering services including mixing, mastering, sound design, and Dolby Atmos production",
          "url": window.location.origin,
          "logo": `${window.location.origin}/lovable-uploads/f7382800-2251-4349-b6ee-b2e753232d10.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "TerraEchoStudios@gmail.com",
            "contactType": "customer service",
            "areaServed": "Worldwide"
          },
          "serviceType": [
            "Audio Mixing",
            "Audio Mastering", 
            "Sound Design",
            "Podcasting",
            "Dolby Atmos Production",
            "Live Sound Engineering"
          ],
          "areaServed": "Worldwide",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Remote Services",
            "addressCountry": "US"
          },
          ...data
        };

      case "service":
        return {
          ...baseData,
          "@type": "Service",
          "serviceType": "Audio Engineering",
          "provider": {
            "@type": "Organization",
            "name": "Will Hall Sound Studios"
          },
          "description": "Professional audio engineering services",
          "areaServed": "Worldwide",
          ...data
        };

      case "portfolio":
        return {
          ...baseData,
          "@type": "CreativeWork",
          "name": "Audio Engineering Portfolio",
          "creator": {
            "@type": "Person",
            "name": "Will Hall"
          },
          "description": "Portfolio of professional audio engineering projects",
          ...data
        };

      default:
        return baseData;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
};

export default StructuredData;
