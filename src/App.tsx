
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
import { MCPProvider } from '@/contexts/MCPContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
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
          </Routes>
        </MCPProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
