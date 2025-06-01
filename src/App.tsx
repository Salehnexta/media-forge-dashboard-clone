
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import About from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import PaymentCallback from "./pages/PaymentCallback";
import AIAnalysis from "./pages/AIAnalysis";
import FreeAnalysis from "./pages/FreeAnalysis";
import FAQ from "./pages/FAQ";
import Support from "./pages/Support";
import HelpCenter from "./pages/HelpCenter";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Status from "./pages/Status";
import Updates from "./pages/Updates";
import Product from "./pages/Product";
import SuccessStories from "./pages/SuccessStories";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/callback" element={<PaymentCallback />} />
            <Route path="/ai-analysis" element={<AIAnalysis />} />
            <Route path="/free-analysis" element={<FreeAnalysis />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/support" element={<Support />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/status" element={<Status />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/product" element={<Product />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
