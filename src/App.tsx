
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import SimpleChat from './pages/SimpleChat';
import Dashboard from './pages/Dashboard';
import RailwayDashboardPage from './pages/RailwayDashboard';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import Home from './pages/Home';
import Features from './pages/Features';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import Support from './pages/Support';
import Payment from './pages/Payment';
import AIAnalysis from './pages/AIAnalysis';
import SuccessStories from './pages/SuccessStories';
import PaymentCallback from './pages/PaymentCallback';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import HowItWorks from './pages/HowItWorks';
import Product from './pages/Product';
import Status from './pages/Status';
import Updates from './pages/Updates';
import { MCPProvider } from '@/contexts/MCPContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LanguageProvider>
            <Toaster position="top-right" />
            <MCPProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<SimpleChat />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/railway" element={<RailwayDashboardPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/support" element={<Support />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-callback" element={<PaymentCallback />} />
                <Route path="/ai-analysis" element={<AIAnalysis />} />
                <Route path="/success-stories" element={<SuccessStories />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/product" element={<Product />} />
                <Route path="/status" element={<Status />} />
                <Route path="/updates" element={<Updates />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MCPProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
