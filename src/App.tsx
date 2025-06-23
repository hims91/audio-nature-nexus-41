
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import MaintenanceBanner from "@/components/MaintenanceBanner";
import Index from "./pages/Index";
import PortfolioPage from "./pages/PortfolioPage";
import ContactPage from "./pages/ContactPage";
import AuthPage from "./pages/AuthPage";
import ManagePortfolio from "./pages/ManagePortfolio";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import CheckoutPage from "./components/shop/CheckoutPage";
import CheckoutOptimized from "./components/shop/CheckoutOptimized";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <BrowserRouter>
              <MaintenanceBanner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/manage-portfolio" element={<ManagePortfolio />} />
                <Route path="/admin/*" element={<Admin />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutOptimized />} />
                <Route path="/checkout-legacy" element={<CheckoutPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failed" element={<PaymentFailed />} />
                <Route path="/order-success" element={<PaymentSuccess />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
