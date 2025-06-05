
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import SimpleChat from './pages/SimpleChat';
import RailwayDashboardPage from './pages/RailwayDashboard';
import { MCPProvider } from '@/contexts/MCPContext';

function App() {
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <MCPProvider>
          <Routes>
            <Route path="/" element={<SimpleChat />} />
            <Route path="/railway" element={<RailwayDashboardPage />} />
          </Routes>
        </MCPProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
