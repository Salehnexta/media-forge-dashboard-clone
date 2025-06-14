
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RailwayAgentPanel } from './RailwayAgentPanel';
import { IntegrationTest } from './IntegrationTest';
import { EnhancedRailwayStatus } from './EnhancedRailwayStatus';
import { Brain, Database, Zap } from 'lucide-react';

interface CompanyData {
  company_name: string;
  industry: string;
  website_url: string;
  description: string;
  target_market: string[];
}

export const RailwayDashboard = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Get client data
        const { data: clients } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .limit(1);
        
        if (clients && clients.length > 0) {
          const client = clients[0];
          
          // Try to get additional company data from content_sources_data
          const { data: companySourceData } = await supabase
            .from('content_sources_data')
            .select('data')
            .eq('client_id', client.id)
            .eq('source_type', 'company_profile')
            .limit(1);
          
          let companyInfo: any = {};
          if (companySourceData && companySourceData.length > 0) {
            companyInfo = companySourceData[0].data as any;
          }
          
          setCompanyData({
            company_name: client.name,
            industry: companyInfo.company_data?.industry || 'تقنية',
            website_url: companyInfo.company_data?.website || '',
            description: companyInfo.company_data?.description || '',
            target_market: companyInfo.company_data?.primary_markets || []
          });
        }
      } catch (error) {
        console.error('Error loading company data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-blue-600" />
            لوحة تحكم Railway AI
          </h1>
          <p className="text-gray-600 text-lg">
            منصة تشغيل الوكلاء الذكيين المتقدمة
          </p>
        </div>

        {/* Status and Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Database className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-bold text-blue-900 mb-2">قاعدة البيانات</h3>
              <p className="text-blue-700 text-sm">Supabase متصل</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-bold text-green-900 mb-2">Railway Backend</h3>
              <p className="text-green-700 text-sm">جاهز للتشغيل</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-bold text-purple-900 mb-2">5 وكلاء ذكيين</h3>
              <p className="text-purple-700 text-sm">متاحين للتشغيل</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Railway Agent Panel */}
          <RailwayAgentPanel className="h-fit" />
          
          {/* Enhanced Railway Status */}
          <EnhancedRailwayStatus />
        </div>

        {/* Integration Test */}
        <IntegrationTest />

        {/* Company Info Display */}
        {companyData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>بيانات الشركة المحملة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>اسم الشركة:</strong> {companyData.company_name}
                </div>
                <div>
                  <strong>الصناعة:</strong> {companyData.industry}
                </div>
                <div>
                  <strong>الموقع الإلكتروني:</strong> {companyData.website_url}
                </div>
                <div>
                  <strong>الوصف:</strong> {companyData.description}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
