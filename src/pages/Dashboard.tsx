import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TravelStyleDashboard } from '@/components/morvo/TravelStyleDashboard';
import { UserDropdownMenu } from '@/components/dashboard/UserDropdownMenu';
import { EnhancedTravelStyleDashboard } from '@/components/morvo/EnhancedTravelStyleDashboard';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Dashboard auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Redirect to auth if no session
        if (!session) {
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    // Redirect to auth page if not authenticated
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Right User Menu */}
      <div className="absolute top-4 right-4 z-50">
        <UserDropdownMenu user={user} onSignOut={handleSignOut} />
      </div>

      {/* Enhanced Travel-Style Dashboard with Dynamic Charts */}
      <EnhancedTravelStyleDashboard />
    </div>
  );
};

export default Dashboard;
