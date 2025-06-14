
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import ContactFormEnhanced from '@/components/enhanced/ContactFormEnhanced';
import Footer from '@/components/Footer';
import FadeInView from '@/components/animations/FadeInView';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | Terra Echo Studios - Professional Audio Engineering</title>
        <meta name="description" content="Get in touch with Terra Echo Studios for professional audio engineering services. Contact us for mixing, mastering, sound design, and more." />
        <meta name="keywords" content="contact audio engineer, audio mixing contact, mastering services contact, sound design inquiry" />
        <link rel="canonical" href="https://terraechostudios.com/contact" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <UnifiedNavbar />
        
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-nature-cream to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInView direction="up" delay={0.2}>
              <div className="text-center">
                <h1 className="text-5xl font-bold text-nature-forest dark:text-white mb-6">
                  Get In Touch
                </h1>
                <p className="text-xl text-nature-bark dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Ready to transform your sound? We'd love to hear about your project and discuss how 
                  Terra Echo Studios can bring your audio vision to life.
                </p>
              </div>
            </FadeInView>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Contact Information */}
              <FadeInView direction="left" delay={0.3}>
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-nature-forest dark:text-white mb-6">
                      Let's Create Something Amazing
                    </h2>
                    <p className="text-nature-bark dark:text-gray-300 text-lg leading-relaxed">
                      Whether you're an independent artist, a production company, or a content creator, 
                      we're here to elevate your audio to professional standards.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-nature-forest rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-nature-forest dark:text-white mb-1">Email</h3>
                        <p className="text-nature-bark dark:text-gray-300">contact@terraechostudios.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-nature-forest rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-nature-forest dark:text-white mb-1">Phone</h3>
                        <p className="text-nature-bark dark:text-gray-300">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-nature-forest rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-nature-forest dark:text-white mb-1">Business Hours</h3>
                        <p className="text-nature-bark dark:text-gray-300">
                          Monday - Friday: 9:00 AM - 7:00 PM PST<br />
                          Weekend sessions by appointment
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-nature-forest rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-nature-forest dark:text-white mb-1">Studio Location</h3>
                        <p className="text-nature-bark dark:text-gray-300">
                          Los Angeles, California<br />
                          Remote services available worldwide
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInView>

              {/* Contact Form */}
              <FadeInView direction="right" delay={0.4}>
                <ContactFormEnhanced />
              </FadeInView>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
