
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/hooks/useSettings";

interface StructuredDataProps {
  type: "website" | "organization" | "service" | "portfolio";
  data?: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data = {} }) => {
  const { data: settings } = useSettings();

  const generateStructuredData = () => {
    const siteName = settings?.site_name || 'Terra Echo Studios';
    const siteDescription = settings?.site_description || 'Professional Audio Engineering Services';
    const contactEmail = settings?.contact_email || 'contact@terraecho.com';

    const baseData = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case "website":
        return {
          ...baseData,
          "@type": "WebSite",
          "name": siteName,
          "description": siteDescription,
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
          "name": siteName,
          "description": siteDescription,
          "url": window.location.origin,
          "logo": `${window.location.origin}/lovable-uploads/7b1e0e62-bb07-45e5-b955-59e6626241d5.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "email": contactEmail,
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
            "name": siteName
          },
          "description": siteDescription,
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
            "name": "Terra Echo Studios"
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
