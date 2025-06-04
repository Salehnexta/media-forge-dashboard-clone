
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Registration from "./pages/Registration";
import Onboarding from "./pages/Onboarding";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Features from "./pages/Features";
import HelpCenter from "./pages/HelpCenter";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import PaymentCallback from "./pages/PaymentCallback";
import Pricing from "./pages/Pricing";
import Privacy from "./pages/Privacy";
import Product from "./pages/Product";
import Status from "./pages/Status";
import SuccessStories from "./pages/SuccessStories";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import Updates from "./pages/Updates";
import AIAnalysis from "./pages/AIAnalysis";
import RailwayDashboard from "./pages/RailwayDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Registration />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/product" element={<Product />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/support" element={<Support />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/status" element={<Status />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/railway" element={<RailwayDashboard />} />
          <Route path="/home" element={<Home />} />
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
