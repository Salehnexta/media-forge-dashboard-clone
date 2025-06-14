
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TravelStyleDashboard } from '@/components/morvo/TravelStyleDashboard';
import { SplitScreenLayout } from '@/components/layout/SplitScreenLayout';
import { Button } from "@/components/ui/button";
import { 
  Brain,
  LogOut,
  ArrowLeft,
  MessageSquare,
  Layout
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showOriginal, setShowOriginal] = useState(false);
  const [showSplitScreen, setShowSplitScreen] = useState(true);
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

  if (showOriginal) {
    // Show original dashboard
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="h-full flex flex-col">
          {/* Top Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">منصة مورفو</h1>
                  <p className="text-sm text-gray-600">مرحباً، {user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowSplitScreen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  الواجهة التفاعلية
                </Button>
                <Button
                  onClick={() => setShowOriginal(false)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  العودة للتصميم الجديد
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Original Dashboard Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة تحكم مورفو AI الأصلية
              </h2>
              <p className="text-gray-600 text-lg">
                النظام الأصلي مع جميع المكونات السابقة
              </p>
            </div>

            <div className="rounded-xl p-6 border bg-blue-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    ✅ اللوحة الأصلية متاحة!
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    يمكنك التبديل بين التصميم الجديد والتصميم الأصلي في أي وقت. التصميم الجديد مستوحى من منصات السفر مع إضافة عناصر التسويق الذكي.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• المستخدم: {user?.email}</div>
                    <div>• قاعدة البيانات: Supabase (متصل)</div>
                    <div>• النظام: جاهز للاستخدام</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSplitScreen) {
    // Show new split-screen layout
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Control Buttons */}
        <div className="absolute top-4 left-4 z-50 flex gap-2">
          <Button
            onClick={() => setShowSplitScreen(false)}
            variant="outline"
            size="sm"
            className="gap-2 bg-white shadow-lg"
          >
            <Layout className="w-4 h-4" />
            التصميم المدمج
          </Button>
          <Button
            onClick={() => setShowOriginal(true)}
            variant="outline"
            size="sm"
            className="gap-2 bg-white shadow-lg"
          >
            اللوحة الأصلية
          </Button>
        </div>
        
        {/* Sign Out Button */}
        <div className="absolute top-4 right-4 z-50">
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="gap-2 bg-white shadow-lg text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>

        {/* Split Screen Layout */}
        <SplitScreenLayout />
      </div>
    );
  }

  // Show travel-style dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Control Buttons */}
      <div className="absolute top-4 left-4 z-50 flex gap-2">
        <Button
          onClick={() => setShowSplitScreen(true)}
          variant="outline"
          size="sm"
          className="gap-2 bg-white shadow-lg"
        >
          <MessageSquare className="w-4 h-4" />
          الواجهة التفاعلية
        </Button>
        <Button
          onClick={() => setShowOriginal(true)}
          variant="outline"
          size="sm"
          className="gap-2 bg-white shadow-lg"
        >
          عرض اللوحة الأصلية
        </Button>
      </div>
      
      {/* Sign Out Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          onClick={handleSignOut}
          variant="outline"
          size="sm"
          className="gap-2 bg-white shadow-lg text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </Button>
      </div>

      {/* Travel-Style Dashboard */}
      <TravelStyleDashboard />
    </div>
  );
};

export default Dashboard;
