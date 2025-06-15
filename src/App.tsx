
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Product from './pages/Product';
import HowItWorks from './pages/HowItWorks';
import AIAnalysis from './pages/AIAnalysis';
import SuccessStories from './pages/SuccessStories';
import Contact from './pages/Contact';
import Support from './pages/Support';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import Payment from './pages/Payment';
import PaymentCallback from './pages/PaymentCallback';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Status from './pages/Status';
import Updates from './pages/Updates';
import NotFound from './pages/NotFound';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/ai-analysis" element={<AIAnalysis />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-callback" element={<PaymentCallback />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/status" element={<Status />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
