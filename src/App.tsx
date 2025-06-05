
import React, { lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MCPProvider } from "@/contexts/MCPContext";
import { UniversalChatWidget } from "@/components/chat/UniversalChatWidget";
import { LazyWrapper } from "@/components/common/LazyWrapper";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const AIAnalysis = lazy(() => import("./pages/AIAnalysis"));
const Product = lazy(() => import("./pages/Product"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Payment = lazy(() => import("./pages/Payment"));
const PaymentCallback = lazy(() => import("./pages/PaymentCallback"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Updates = lazy(() => import("./pages/Updates"));
const Support = lazy(() => import("./pages/Support"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Status = lazy(() => import("./pages/Status"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SimpleChat = lazy(() => import("./pages/SimpleChat"));

// Enhanced Query Client with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <MCPProvider>
          <TooltipProvider>
            <div className="min-h-screen font-cairo" dir="rtl">
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <LazyWrapper>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/simple-chat" element={<SimpleChat />} />
                    <Route path="/ai-analysis" element={<AIAnalysis />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/payment-callback" element={<PaymentCallback />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/success-stories" element={<SuccessStories />} />
                    <Route path="/updates" element={<Updates />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/help-center" element={<HelpCenter />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </LazyWrapper>
                <UniversalChatWidget />
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </MCPProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
