import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  siteName?: string;
  description?: string;
  logo?: string;
  contactEmail?: string;
  socialLinks?: Array<{ platform: string; url: string }>;
}

const OrganizationSchema: React.FC<OrganizationSchemaProps> = memo(({
  siteName = "Terra Echo Studios",
  description = "Professional Audio Engineering Services",
  logo = "/lovable-uploads/f7382800-2251-4349-b6ee-b2e753232d10.png",
  contactEmail = "TerraEchoStudios@gmail.com",
  socialLinks = []
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "description": description,
    "url": window.location.origin,
    "logo": `${window.location.origin}${logo}`,
    "email": contactEmail,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "email": contactEmail
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": socialLinks.map(link => link.url).filter(Boolean)
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/shop?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
});

OrganizationSchema.displayName = 'OrganizationSchema';

export default OrganizationSchema;