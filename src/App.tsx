import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'sonner';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import CategoryDetail from '@/pages/CategoryDetail';
import CustomerOrderHistory from '@/pages/CustomerOrderHistory';
import CustomerOrderDetail from '@/pages/CustomerOrderDetail';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Returns from '@/pages/Returns';
import SearchResults from '@/pages/SearchResults';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminProductDetail from '@/pages/admin/AdminProductDetail';
import AdminProductForm from '@/pages/admin/components/AdminProductForm';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminOrderDetail from '@/pages/admin/AdminOrderDetail';
import AdminDiscounts from '@/pages/admin/AdminDiscounts';

import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import ShoppingCart from '@/pages/ShoppingCart';
import OrderTrackingPage from '@/pages/OrderTrackingPage';

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:slug" element={<ProductDetail />} />
                  <Route path="/categories/:slug" element={<CategoryDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/returns" element={<Returns />} />

                  <Route path="/orders" element={<CustomerOrderHistory />} />
                  <Route path="/orders/:id" element={<CustomerOrderDetail />} />
                  <Route path="/checkout" element={<Checkout />} />

                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/products/new" element={<AdminProductForm />} />
                  <Route path="/admin/products/:id" element={<AdminProductDetail />} />
                  <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                  <Route path="/admin/discounts" element={<AdminDiscounts />} />

                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="*" element={<NotFound />} />
                  
                  <Route path="/shop/cart" element={<ShoppingCart />} />
                  <Route path="/orders/:id" element={<OrderTrackingPage />} />
                  
                </Routes>
              </main>
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </QueryClient>
    </BrowserRouter>
  );
}

export default App;
