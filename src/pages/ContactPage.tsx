
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactFormEnhanced from "@/components/enhanced/ContactFormEnhanced";
import { Helmet } from "react-helmet-async";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import StructuredData from "@/components/SEO/StructuredData";
import SocialMeta from "@/components/SEO/SocialMeta";

const ContactPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Contact - Will Hall Sound Studios | Get In Touch</title>
        <meta name="description" content="Contact Will Hall Sound Studios for professional audio engineering services. Get in touch to discuss your next project." />
        <meta name="keywords" content="contact audio engineer, professional audio services, audio consultation, mixing mastering quote" />
        <link rel="canonical" href={`${window.location.origin}/contact`} />
      </Helmet>

      <StructuredData type="service" />
      
      <SocialMeta
        title="Contact - Will Hall Sound Studios"
        description="Contact Will Hall Sound Studios for professional audio engineering services. Get in touch to discuss your next project."
        url={`${window.location.origin}/contact`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-white via-nature-mist/30 to-nature-sage/20">
        <Navbar />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-nature-forest mb-6">
                Let's Create <span className="text-gradient">Together</span>
              </h1>
              <p className="text-xl text-nature-bark max-w-2xl mx-auto mb-8">
                Ready to bring your audio vision to life? Let's discuss your project and explore how we can achieve sonic excellence together.
              </p>
            </div>
          </section>

          {/* Contact Information Cards */}
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
                <Mail className="w-8 h-8 text-nature-forest mx-auto mb-4" />
                <h3 className="font-semibold text-nature-forest mb-2">Email</h3>
                <p className="text-nature-bark text-sm">TerraEchoStudios@gmail.com</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
                <Phone className="w-8 h-8 text-nature-forest mx-auto mb-4" />
                <h3 className="font-semibold text-nature-forest mb-2">Phone</h3>
                <p className="text-nature-bark text-sm">Available upon request</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
                <MapPin className="w-8 h-8 text-nature-forest mx-auto mb-4" />
                <h3 className="font-semibold text-nature-forest mb-2">Location</h3>
                <p className="text-nature-bark text-sm">Remote & Studio Sessions</p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 text-center shadow-lg">
                <Clock className="w-8 h-8 text-nature-forest mx-auto mb-4" />
                <h3 className="font-semibold text-nature-forest mb-2">Response Time</h3>
                <p className="text-nature-bark text-sm">Within 24 hours</p>
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-16 px-4">
            <ContactFormEnhanced />
          </section>

          {/* Additional Information */}
          <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-nature-forest mb-8">What to Expect</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="w-12 h-12 bg-nature-forest text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold text-nature-forest mb-2">Initial Consultation</h3>
                  <p className="text-nature-bark text-sm">We'll discuss your project goals, timeline, and creative vision in detail.</p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-nature-forest text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold text-nature-forest mb-2">Custom Proposal</h3>
                  <p className="text-nature-bark text-sm">Receive a detailed proposal with timeline, deliverables, and transparent pricing.</p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-nature-forest text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold text-nature-forest mb-2">Collaborative Process</h3>
                  <p className="text-nature-bark text-sm">Work together throughout the project with regular updates and feedback sessions.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
