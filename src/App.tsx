
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SEOHelmetProvider from "@/components/SEO/HelmetProvider";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { useEffect } from "react";
import { initGA, trackPageView } from "@/utils/analytics";
import Index from "./pages/Index";
import PortfolioPage from "./pages/PortfolioPage";
import ContactPage from "./pages/ContactPage";
import ManagePortfolio from "./pages/ManagePortfolio";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { hasUpdate, updateServiceWorker } = useServiceWorker();

  useEffect(() => {
    // Initialize Google Analytics
    initGA();
    
    // Track initial page view
    trackPageView(window.location.pathname);
  }, []);

  // Show update notification
  useEffect(() => {
    if (hasUpdate) {
      const shouldUpdate = window.confirm(
        'A new version is available. Would you like to update now?'
      );
      if (shouldUpdate) {
        updateServiceWorker();
      }
    }
  }, [hasUpdate, updateServiceWorker]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/auth" element={<Auth />} />
      <Route 
        path="/manage-portfolio" 
        element={
          <ProtectedRoute>
            <ManagePortfolio />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SEOHelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </SEOHelmetProvider>
  </QueryClientProvider>
);

export default App;
