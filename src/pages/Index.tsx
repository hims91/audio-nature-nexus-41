
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import LiveEventWork from "@/components/LiveEventWork";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <LiveEventWork />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
