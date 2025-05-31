
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { StrategicCharts } from '../charts/StrategicCharts';
import { OnboardingRestart } from '../../dashboard/OnboardingRestart';

export const MorvoDashboard = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">لوحة تحكم Morvo</h1>
          <p className="text-gray-600">نظرة عامة شاملة على منصة التسويق الذكي</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <StrategicCharts />
          </div>
          <div>
            {user && <OnboardingRestart user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
};
