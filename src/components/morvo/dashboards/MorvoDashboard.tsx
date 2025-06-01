import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { StrategicCharts } from '../charts/StrategicCharts';
import { OnboardingRestart } from '../../dashboard/OnboardingRestart';
import { RailwayAgentPanel } from '../../railway/RailwayAgentPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, BarChart3, Target, Zap } from 'lucide-react';
export const MorvoDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(({
      data: {
        user
      }
    }) => {
      setUser(user);
    });
  }, []);
  return <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">لوحة تحكم Morvo</h1>
          <p className="text-gray-600">نظرة عامة شاملة على منصة التسويق الذكي</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Analytics Section */}
          <div className="lg:col-span-2 space-y-6">
            <StrategicCharts />
          </div>
          
          {/* Right Sidebar */}
          
        </div>

        {/* Railway Features Overview */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
            
            
          </Card>
        </div>
      </div>
    </div>;
};