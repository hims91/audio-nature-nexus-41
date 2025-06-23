
import React from 'react';
import { Helmet } from 'react-helmet-async';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import Footer from '@/components/Footer';
import PaymentStatus from '@/components/shop/PaymentStatus';

const PaymentFailed: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Payment Failed - Terra Echo Studios</title>
        <meta name="description" content="There was an issue processing your payment." />
      </Helmet>

      <UnifiedNavbar />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <PaymentStatus type="failed" />
      </div>
      
      <Footer />
    </>
  );
};

export default PaymentFailed;
