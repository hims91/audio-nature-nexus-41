
import React from "react";
import { HelmetProvider } from "react-helmet-async";

interface SEOHelmetProviderProps {
  children: React.ReactNode;
}

const SEOHelmetProvider: React.FC<SEOHelmetProviderProps> = ({ children }) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};

export default SEOHelmetProvider;
