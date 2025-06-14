
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HelmetProvider from "@/components/SEO/HelmetProvider";
import ErrorBoundary from "@/components/security/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthEnhanced from "./pages/AuthEnhanced";
import ContactPage from "./pages/ContactPage";
import PortfolioPage from "./pages/PortfolioPage";
import ManagePortfolio from "./pages/ManagePortfolio";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error?.message?.includes('401') || error?.message?.includes('403')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider>
            <AuthProvider>
              <TooltipProvider>
                <Router>
                  <div className="min-h-screen">
                    <Helmet>
                      <title>Terra Echo Studios</title>
                      <meta name="description" content="Professional audio engineering and production services" />
                      <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' blob: https:;" />
                    </Helmet>
                    
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/auth-enhanced" element={<AuthEnhanced />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/portfolio" element={<PortfolioPage />} />
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
                    
                    <Toaster />
                  </div>
                </Router>
              </TooltipProvider>
            </AuthProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
