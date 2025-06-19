
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { EnhancedAuthProvider } from "@/contexts/EnhancedAuthContext";
import HelmetProvider from "@/components/SEO/HelmetProvider";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import AuthEnhanced from "./pages/AuthEnhanced";
import ProfilePage from "./pages/ProfilePage";
import PortfolioPage from "./pages/PortfolioPage";
import ContactPage from "./pages/ContactPage";
import MaintenancePage from "./pages/MaintenancePage";
import NotFound from "./pages/NotFound";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderCancelPage from "./pages/OrderCancelPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminInventory from "./pages/admin/AdminInventory";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminGuard from "./components/admin/AdminGuard";
import ErrorBoundary from "./components/security/ErrorBoundary";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider defaultTheme="system">
            <TooltipProvider>
              <BrowserRouter>
                <AuthProvider>
                  <EnhancedAuthProvider>
                    <div className="min-h-screen bg-background font-sans antialiased">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<AuthEnhanced />} />
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/shop/cart" element={<CartPage />} />
                        <Route path="/shop/products/:slug" element={<ProductDetailPage />} />
                        <Route path="/order/success" element={<OrderSuccessPage />} />
                        <Route path="/order/cancel" element={<OrderCancelPage />} />
                        <Route path="/maintenance" element={<MaintenancePage />} />
                        
                        {/* Protected Routes */}
                        <Route path="/profile" element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={
                          <ProtectedRoute>
                            <AdminGuard>
                              <AdminLayout />
                            </AdminGuard>
                          </ProtectedRoute>
                        }>
                          <Route index element={<AdminDashboard />} />
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="portfolio" element={<AdminPortfolio />} />
                          <Route path="products" element={<AdminProducts />} />
                          <Route path="orders" element={<AdminOrders />} />
                          <Route path="inventory" element={<AdminInventory />} />
                          <Route path="analytics" element={<AdminAnalytics />} />
                          <Route path="users" element={<AdminUsers />} />
                          <Route path="settings" element={<AdminSettings />} />
                        </Route>
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <Toaster />
                    </div>
                  </EnhancedAuthProvider>
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
