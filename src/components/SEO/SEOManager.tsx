
import React from "react";
import SocialMeta from "./SocialMeta";
import StructuredData from "./StructuredData";
import SitemapGenerator from "./SitemapGenerator";
import { Helmet } from "react-helmet-async";

interface SEOManagerProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredDataType?: "website" | "organization" | "service" | "portfolio";
  structuredData?: Record<string, any>;
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title = "Terra Echo Studios | Professional Audio Engineering Services",
  description = "Professional audio engineering services including mixing, mastering, sound design, and Dolby Atmos production. Transform your sound with our expert services.",
  image,
  url,
  type = "website",
  keywords = [
    "audio engineering",
    "mixing",
    "mastering", 
    "sound design",
    "recording studio",
    "podcasting",
    "dolby atmos",
    "professional audio services",
    "music production",
    "post production audio"
  ],
  author = "Terra Echo Studios",
  publishedTime,
  modifiedTime,
  structuredDataType = "website",
  structuredData = {}
}) => {
  const canonicalUrl = url || window.location.href;
  const keywordsString = keywords.join(", ");

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywordsString} />
        <meta name="author" content={author} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Article specific meta tags */}
        {type === "article" && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === "article" && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {type === "article" && author && (
          <meta property="article:author" content={author} />
        )}

        {/* Robots and crawling */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Mobile and PWA */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#22543D" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Terra Echo Studios" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Language and locale */}
        <meta httpEquiv="content-language" content="en-US" />
        <meta property="og:locale" content="en_US" />
      </Helmet>

      <SocialMeta
        title={title}
        description={description}
        image={image}
        url={canonicalUrl}
        type={type}
      />

      <StructuredData
        type={structuredDataType}
        data={structuredData}
      />

      <SitemapGenerator />
    </>
  );
};

export default SEOManager;
