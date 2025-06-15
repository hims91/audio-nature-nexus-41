
import React from "react";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/hooks/useSettings";

interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
}

const SocialMeta: React.FC<SocialMetaProps> = ({
  title,
  description,
  image = "/lovable-uploads/f7382800-2251-4349-b6ee-b2e753232d10.png",
  url,
  type = "website",
  twitterCard = "summary_large_image"
}) => {
  const { data: settings } = useSettings();
  const currentUrl = url || window.location.href;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;

  const siteName = settings?.site_name || "Terra Echo Studios";

  return (
    <Helmet>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@willhallsound" />
      <meta name="twitter:creator" content="@willhallsound" />

      {/* Additional meta tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SocialMeta;
