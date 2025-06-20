
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardOverview from './pages/DashboardOverview';
import DashboardProfile from './pages/DashboardProfile';
import DashboardOrders from './pages/DashboardOrders';
import DashboardAddresses from './pages/DashboardAddresses';
import DashboardPayments from './pages/DashboardPayments';
import DashboardNotifications from './pages/DashboardNotifications';
import DashboardActivity from './pages/DashboardActivity';
import DashboardSettings from './pages/DashboardSettings';

const DashboardContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardOverview />} />
      <Route path="/profile" element={<DashboardProfile />} />
      <Route path="/orders" element={<DashboardOrders />} />
      <Route path="/addresses" element={<DashboardAddresses />} />
      <Route path="/payments" element={<DashboardPayments />} />
      <Route path="/notifications" element={<DashboardNotifications />} />
      <Route path="/activity" element={<DashboardActivity />} />
      <Route path="/settings" element={<DashboardSettings />} />
    </Routes>
  );
};

export default DashboardContent;
