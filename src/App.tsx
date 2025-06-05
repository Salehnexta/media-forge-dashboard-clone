import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { Toaster } from 'sonner';

import SimpleChat from './pages/SimpleChat';
import RailwayDashboardPage from './pages/RailwayDashboard';
import { ChatPage } from './pages/ChatPage';
import { MCPProvider } from '@/contexts/MCPContext';

function App() {
  return (
    <BrowserRouter>
      <QueryClient>
        <Toaster />
        <MCPProvider>
          <Routes>
            <Route path="/" element={<SimpleChat />} />
            <Route path="/railway" element={<RailwayDashboardPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </MCPProvider>
      </QueryClient>
    </BrowserRouter>
  );
}

export default App;
