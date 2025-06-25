
import React from 'react';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import ContactFormEnhanced from '@/components/enhanced/ContactFormEnhanced';
import Footer from '@/components/Footer';
import SEOManager from '@/components/SEO/SEOManager';
import FadeInView from '@/components/animations/FadeInView';

const ContactPage = () => {
  return (
    <>
      <SEOManager
        title="Contact Us | Terra Echo Studios - Professional Audio Engineering Services"
        description="Get in touch with Terra Echo Studios for professional audio engineering services. Contact us for mixing, mastering, sound design, and Dolby Atmos production inquiries."
        keywords={[
          "contact terra echo studios",
          "audio engineering contact",
          "mixing mastering inquiry",
          "sound design consultation",
          "dolby atmos services",
          "professional audio contact",
          "studio booking"
        ]}
        structuredDataType="service"
        structuredData={{
          serviceType: "Audio Engineering Consultation",
          description: "Professional audio engineering consultation and project inquiry"
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <UnifiedNavbar />
        
        <main className="pt-20">
          <div className="container mx-auto px-4 py-12">
            <FadeInView direction="up">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-nature-forest dark:text-white mb-4">
                  Get In Touch
                </h1>
                <p className="text-xl text-nature-bark dark:text-gray-300 max-w-3xl mx-auto">
                  Ready to transform your sound? Contact us today to discuss your project 
                  and discover how our professional audio engineering services can elevate your work.
                </p>
              </div>
            </FadeInView>

            <FadeInView direction="up" delay={0.2}>
              <div className="max-w-4xl mx-auto">
                <ContactFormEnhanced />
              </div>
            </FadeInView>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
