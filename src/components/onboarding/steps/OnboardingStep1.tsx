
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Globe, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OnboardingStep1Props {
  data: any;
  onDataChange: (data: any) => void;
}

const industryOptions = [
  'تكنولوجيا المعلومات',
  'التجارة الإلكترونية',
  'التعليم',
  'الصحة والطب',
  'المالية والمصرفية',
  'العقارات',
  'الطعام والمشروبات',
  'الأزياء والجمال',
  'السياحة والسفر',
  'الخدمات المهنية',
  'التصنيع',
  'أخرى'
];

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '200+'
];

export const OnboardingStep1 = ({ data, onDataChange }: OnboardingStep1Props) => {
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'completed' | 'error'>('idle');
  const [autoDiscoveredData, setAutoDiscoveredData] = useState<any>({});

  const handleWebsiteAnalysis = async () => {
    if (!data.websiteUrl) {
      toast.error('يرجى إدخال رابط الموقع أولاً');
      return;
    }

    setAnalysisStatus('analyzing');
    
    try {
      const { data: analysisResult, error } = await supabase.functions.invoke('analyze-website-perplexity', {
        body: { website: data.websiteUrl }
      });

      if (error) {
        console.error('Analysis error:', error);
        setAnalysisStatus('error');
        toast.error('فشل في تحليل الموقع');
        return;
      }

      setAutoDiscoveredData(analysisResult);
      setAnalysisStatus('completed');
      toast.success('تم تحليل الموقع بنجاح!');
      
      // Auto-fill form with discovered data
      onDataChange({
        ...data,
        autoDiscoveredData: analysisResult,
        industry: analysisResult.industry || data.industry,
        businessDescription: analysisResult.businessDescription || data.businessDescription
      });
      
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisStatus('error');
      toast.error('حدث خطأ أثناء تحليل الموقع');
    }
  };

  const approveDiscoveredData = (field: string, approved: boolean) => {
    const updatedData = {
      ...data,
      dataApprovalStatus: {
        ...data.dataApprovalStatus,
        [field]: approved
      }
    };
    onDataChange(updatedData);
  };

  // Helper function to safely render text content
  const renderText = (content: any) => {
    if (typeof content === 'string') {
      return content;
    }
    if (content && typeof content === 'object') {
      // If it's an object with language keys, prefer Arabic first, then English
      if (content.arabic) {
        return content.arabic;
      }
      if (content.english) {
        return content.english;
      }
      // If it's some other object, convert to string
      return JSON.stringify(content);
    }
    return String(content || '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Website Analysis Section */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Globe className="w-5 h-5 text-blue-600" />
            <span>تحليل الموقع الإلكتروني</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="websiteUrl">رابط الموقع الإلكتروني</Label>
            <div className="flex space-x-2 space-x-reverse">
              <Input
                id="websiteUrl"
                value={data.websiteUrl || ''}
                onChange={(e) => onDataChange({ ...data, websiteUrl: e.target.value })}
                placeholder="https://example.com"
                className="flex-1"
              />
              <Button
                onClick={handleWebsiteAnalysis}
                disabled={analysisStatus === 'analyzing' || !data.websiteUrl}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {analysisStatus === 'analyzing' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'تحليل'
                )}
              </Button>
            </div>
          </div>

          {analysisStatus === 'analyzing' && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-slate-600">جاري تحليل الموقع...</p>
              </div>
            </div>
          )}

          {analysisStatus === 'completed' && autoDiscoveredData && (
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">البيانات المكتشفة:</h4>
              
              {autoDiscoveredData.businessDescription && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">وصف النشاط التجاري</span>
                    <div className="flex space-x-1 space-x-reverse">
                      <Button
                        size="sm"
                        variant={data.dataApprovalStatus?.businessDescription ? "default" : "outline"}
                        onClick={() => approveDiscoveredData('businessDescription', true)}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={data.dataApprovalStatus?.businessDescription === false ? "destructive" : "outline"}
                        onClick={() => approveDiscoveredData('businessDescription', false)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{renderText(autoDiscoveredData.businessDescription)}</p>
                </div>
              )}

              {autoDiscoveredData.competitors && Array.isArray(autoDiscoveredData.competitors) && autoDiscoveredData.competitors.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">المنافسون</span>
                    <div className="flex space-x-1 space-x-reverse">
                      <Button
                        size="sm"
                        variant={data.dataApprovalStatus?.competitors ? "default" : "outline"}
                        onClick={() => approveDiscoveredData('competitors', true)}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={data.dataApprovalStatus?.competitors === false ? "destructive" : "outline"}
                        onClick={() => approveDiscoveredData('competitors', false)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {autoDiscoveredData.competitors.map((competitor: any, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {renderText(competitor)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {autoDiscoveredData.keywords && Array.isArray(autoDiscoveredData.keywords) && autoDiscoveredData.keywords.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">الكلمات المفتاحية</span>
                    <div className="flex space-x-1 space-x-reverse">
                      <Button
                        size="sm"
                        variant={data.dataApprovalStatus?.keywords ? "default" : "outline"}
                        onClick={() => approveDiscoveredData('keywords', true)}
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={data.dataApprovalStatus?.keywords === false ? "destructive" : "outline"}
                        onClick={() => approveDiscoveredData('keywords', false)}
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {autoDiscoveredData.keywords.map((keyword: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {renderText(keyword)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {analysisStatus === 'error' && (
            <div className="text-center p-4 text-red-600">
              <XCircle className="w-8 h-8 mx-auto mb-2" />
              <p>فشل في تحليل الموقع</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Profile Section */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>ملف الشركة</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="companyNameAr">اسم الشركة (بالعربية) *</Label>
              <Input
                id="companyNameAr"
                value={data.companyNameAr || ''}
                onChange={(e) => onDataChange({ ...data, companyNameAr: e.target.value })}
                placeholder="اسم شركتك بالعربية"
              />
            </div>

            <div>
              <Label htmlFor="companyNameEn">Company Name (English) *</Label>
              <Input
                id="companyNameEn"
                value={data.companyNameEn || ''}
                onChange={(e) => onDataChange({ ...data, companyNameEn: e.target.value })}
                placeholder="Your company name in English"
              />
            </div>

            <div>
              <Label htmlFor="industry">الصناعة *</Label>
              <Select 
                value={data.industry || ''} 
                onValueChange={(value) => onDataChange({ ...data, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر الصناعة" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="companySize">حجم الشركة</Label>
              <Select 
                value={data.companySize || ''} 
                onValueChange={(value) => onDataChange({ ...data, companySize: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر حجم الشركة" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} موظف
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessType">نوع النشاط</Label>
              <Select 
                value={data.businessType || ''} 
                onValueChange={(value) => onDataChange({ ...data, businessType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B2B">B2B - أعمال لأعمال</SelectItem>
                  <SelectItem value="B2C">B2C - أعمال لمستهلكين</SelectItem>
                  <SelectItem value="Both">كلاهما</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationCountry">البلد</Label>
                <Input
                  id="locationCountry"
                  value={data.locationCountry || 'Saudi Arabia'}
                  onChange={(e) => onDataChange({ ...data, locationCountry: e.target.value })}
                  placeholder="المملكة العربية السعودية"
                />
              </div>
              <div>
                <Label htmlFor="locationCity">المدينة</Label>
                <Input
                  id="locationCity"
                  value={data.locationCity || ''}
                  onChange={(e) => onDataChange({ ...data, locationCity: e.target.value })}
                  placeholder="الرياض"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="yearsInBusiness">سنوات الخبرة</Label>
              <Select 
                value={data.yearsInBusiness || ''} 
                onValueChange={(value) => onDataChange({ ...data, yearsInBusiness: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر سنوات الخبرة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="<1">أقل من سنة</SelectItem>
                  <SelectItem value="1-3">1-3 سنوات</SelectItem>
                  <SelectItem value="3-5">3-5 سنوات</SelectItem>
                  <SelectItem value="5+">أكثر من 5 سنوات</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessDescription">وصف النشاط التجاري</Label>
              <Textarea
                id="businessDescription"
                value={data.businessDescription || ''}
                onChange={(e) => onDataChange({ ...data, businessDescription: e.target.value })}
                placeholder="صف نشاط شركتك والخدمات التي تقدمها..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
