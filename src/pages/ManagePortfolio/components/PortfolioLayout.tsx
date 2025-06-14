
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PortfolioLayoutProps {
  children: React.ReactNode;
}

const PortfolioLayout: React.FC<PortfolioLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 bg-nature-cream/30">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioLayout;
