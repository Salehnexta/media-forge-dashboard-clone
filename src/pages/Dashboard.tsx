
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DashboardSplitContent } from '@/components/dashboard/DashboardSplitContent';
import { MetricsOverview } from '@/components/morvo/MetricsOverview';
import { ChartsSection } from '@/components/morvo/ChartsSection';
import { AgentStatusDashboard } from '@/components/morvo/AgentStatusDashboard';
import { Button } from "@/components/ui/button";
import { 
  Users,
  Megaphone,
  PenTool,
  BarChart3,
  Target,
  Bell,
  Search,
  User,
  Brain,
  LogOut
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('استراتيجي');
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

  const tabs = [
    { id: 'استراتيجي', label: 'استراتيجي', icon: Target },
    { id: 'محتوى', label: 'محتوى', icon: PenTool },
    { id: 'حملات', label: 'حملات', icon: Megaphone },
    { id: 'سوشال', label: 'سوشال', icon: Users },
    { id: 'تحليلات', label: 'تحليلات', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <DashboardSplitContent>
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

              {/* Top Navigation Tabs */}
              <div className="flex items-center gap-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                ))}
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4" />
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

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Page Title */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                لوحة تحكم مورفو AI
              </h2>
              <p className="text-gray-600 text-lg">
                نظام التسويق الذكي مع Supabase
              </p>
            </div>

            {/* Agent Status Dashboard */}
            <div className="mb-8">
              <AgentStatusDashboard />
            </div>

            {/* Metrics Overview */}
            <div className="mb-8">
              <MetricsOverview />
            </div>

            {/* Charts Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-blue-600 mb-4">
                المؤشرات الاستراتيجية - {activeTab}
              </h3>
              <p className="text-gray-600 mb-6">
                مؤشرات الأداء مع البيانات المحلية
              </p>
              <ChartsSection selectedManager="strategic" />
            </div>

            {/* Status Message */}
            <div className="rounded-xl p-6 border bg-green-50 border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-green-600">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    ✅ تم تسجيل الدخول بنجاح!
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    مرحباً بك في منصة مورفو AI. النظام متصل مع قاعدة بيانات Supabase ويعمل بكامل طاقته.
                  </p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>• المستخدم: {user?.email}</div>
                    <div>• قاعدة البيانات: Supabase (متصل)</div>
                    <div>• الحفظ: آمن ومحمي</div>
                    <div>• النظام: جاهز للاستخدام</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardSplitContent>
    </div>
  );
};

export default Dashboard;
