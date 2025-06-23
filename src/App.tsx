
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from "@/contexts/AuthContext";
import { EnhancedAuthProvider } from "@/contexts/EnhancedAuthContext";
import MaintenanceBanner from "@/components/MaintenanceBanner";
import Index from "./pages/Index";
import PortfolioPage from "./pages/PortfolioPage";
import ContactPage from "./pages/ContactPage";
import Auth from "./pages/Auth";
import ManagePortfolio from "./pages/ManagePortfolio";
import Admin from "./pages/admin/AdminDashboard";
import DashboardPage from "./pages/DashboardPage";
import ShopPage from "./pages/ShopPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
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
            <EnhancedAuthProvider>
              <Toaster />
              <BrowserRouter>
                <MaintenanceBanner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/manage-portfolio" element={<ManagePortfolio />} />
                  <Route path="/admin/*" element={<Admin />} />
                  <Route path="/dashboard/*" element={<DashboardPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutOptimized />} />
                  <Route path="/checkout-legacy" element={<CheckoutPage />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                  <Route path="/order-success" element={<PaymentSuccess />} />
                </Routes>
              </BrowserRouter>
            </EnhancedAuthProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
