
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import PaymentStatus from '@/components/shop/PaymentStatus';

const PaymentSuccess: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Payment Successful - Terra Echo Studios</title>
        <meta name="description" content="Your payment has been successfully processed." />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <PaymentStatus type="success" />
      </div>
      
      <Footer />
    </>
  );
};

export default PaymentSuccess;
