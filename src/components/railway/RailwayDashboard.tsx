
import React, { useState, useEffect } from 'react';
import { AgentRunner } from './AgentRunner';
import { RailwayStatus } from './RailwayStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CompanyData } from '@/hooks/useRailwayAgent';
import { supabase } from '@/integrations/supabase/client';
import { Database, Rocket } from 'lucide-react';

export const RailwayDashboard = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setCompanyData({
          company_name: profile.name,
          industry: profile.industry,
          website_url: profile.website || undefined,
          description: profile.description || undefined,
          target_market: profile.primary_markets || undefined
        });
      }
    } catch (error) {
      console.error('Error loading company profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleCompanyDataChange = (field: keyof CompanyData, value: any) => {
    setCompanyData(prev => prev ? { ...prev, [field]: value } : null);
  };

  if (isLoadingProfile) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-cairo flex items-center justify-center">
        <div className="text-center">
          <Database className="w-16 h-16 mx-auto mb-4 animate-pulse text-blue-600" />
          <p className="text-gray-600">جاري تحميل بيانات الشركة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Rocket className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-600">منصة Railway AI</h1>
          </div>
          <p className="text-gray-600 text-lg">
            منصة الوكلاء الذكيين المتقدمة للتسويق والتحليل
          </p>
        </div>

        <RailwayStatus />

        {!companyData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                بيانات الشركة مطلوبة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  يرجى إدخال بيانات شركتك لتتمكن من استخدام الوكلاء الذكيين
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">اسم الشركة</Label>
                    <Input
                      id="company_name"
                      placeholder="مثال: شركة التقنية المتقدمة"
                      onChange={(e) => setCompanyData({
                        company_name: e.target.value,
                        industry: '',
                        website_url: '',
                        description: ''
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">الصناعة</Label>
                    <Input
                      id="industry"
                      placeholder="مثال: التقنية"
                      onChange={(e) => handleCompanyDataChange('industry', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">الموقع الإلكتروني</Label>
                    <Input
                      id="website"
                      placeholder="https://example.com"
                      onChange={(e) => handleCompanyDataChange('website_url', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">وصف الشركة</Label>
                    <Textarea
                      id="description"
                      placeholder="وصف مختصر عن الشركة وخدماتها"
                      onChange={(e) => handleCompanyDataChange('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {companyData && (
          <AgentRunner companyData={companyData} />
        )}
      </div>
    </div>
  );
};
