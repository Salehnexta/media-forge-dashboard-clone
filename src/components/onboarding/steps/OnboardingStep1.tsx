
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { OnboardingData } from '../EnhancedSmartOnboarding';

interface OnboardingStep1Props {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
  onAnalyzeWebsite: (websiteUrl: string) => void;
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

const companySizes = ['1-10', '11-50', '51-200', '200+'];
const businessTypes = ['B2B', 'B2C', 'كلاهما'];
const yearsOptions = ['أقل من سنة', '1-3 سنوات', '3-5 سنوات', '5+ سنوات'];

export const OnboardingStep1 = ({ data, onDataChange, onAnalyzeWebsite }: OnboardingStep1Props) => {
  const [websiteInput, setWebsiteInput] = useState(data.websiteUrl);

  const handleAnalyze = () => {
    if (websiteInput.trim()) {
      onAnalyzeWebsite(websiteInput.trim());
    }
  };

  const handleApproveData = (key: string, approved: boolean) => {
    onDataChange({
      dataApprovalStatus: {
        ...data.dataApprovalStatus,
        [key]: approved
      }
    });

    // تطبيق البيانات المعتمدة تلقائياً
    if (approved && data.autoDiscoveredData) {
      const updates: Partial<OnboardingData> = {};
      
      if (key === 'industry') {
        updates.industry = data.autoDiscoveredData.industry;
      } else if (key === 'companyName') {
        updates.companyNameAr = data.autoDiscoveredData.name;
      }
      
      if (Object.keys(updates).length > 0) {
        onDataChange(updates);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* قسم تحليل الموقع */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Sparkles className="w-5 h-5" />
            التحليل الذكي للموقع الإلكتروني
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="websiteUrl">رابط الموقع الإلكتروني</Label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <Globe className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteInput}
                  onChange={(e) => setWebsiteInput(e.target.value)}
                  placeholder="https://example.com"
                  className="pr-10"
                  dir="ltr"
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={!websiteInput.trim() || data.websiteAnalysisStatus === 'analyzing'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {data.websiteAnalysisStatus === 'analyzing' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'تحليل'
                )}
              </Button>
            </div>
          </div>

          {data.websiteAnalysisStatus === 'analyzing' && (
            <div className="text-center py-6">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-blue-800 font-medium">جاري تحليل موقعك بتقنية الذكاء الاصطناعي...</p>
              <p className="text-blue-600 text-sm mt-1">قد يستغرق هذا دقيقة أو دقيقتين</p>
            </div>
          )}

          {data.websiteAnalysisStatus === 'completed' && data.autoDiscoveredData && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-700 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">تم التحليل بنجاح! راجع البيانات أدناه:</span>
              </div>

              {/* عرض البيانات المكتشفة */}
              <div className="grid gap-4">
                {data.autoDiscoveredData.name && (
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">اسم الشركة</h4>
                          <p className="text-gray-700">{data.autoDiscoveredData.name}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={data.dataApprovalStatus.companyName ? 'default' : 'outline'}
                            onClick={() => handleApproveData('companyName', !data.dataApprovalStatus.companyName)}
                            className="text-xs"
                          >
                            {data.dataApprovalStatus.companyName ? 'معتمد ✓' : 'اعتماد'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {data.autoDiscoveredData.industry && (
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">القطاع</h4>
                          <p className="text-gray-700">{data.autoDiscoveredData.industry}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={data.dataApprovalStatus.industry ? 'default' : 'outline'}
                            onClick={() => handleApproveData('industry', !data.dataApprovalStatus.industry)}
                            className="text-xs"
                          >
                            {data.dataApprovalStatus.industry ? 'معتمد ✓' : 'اعتماد'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {data.autoDiscoveredData.description && (
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">وصف النشاط</h4>
                      <p className="text-gray-700 text-sm">{data.autoDiscoveredData.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {data.websiteAnalysisStatus === 'error' && (
            <div className="flex items-center gap-2 text-red-700 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5" />
              <span>فشل في تحليل الموقع. يرجى المحاولة مرة أخرى أو إدخال البيانات يدوياً.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ملف الشركة الأساسي */}
      <Card>
        <CardHeader>
          <CardTitle>ملف الشركة الأساسي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyNameAr">اسم الشركة باللغة العربية *</Label>
              <Input
                id="companyNameAr"
                value={data.companyNameAr}
                onChange={(e) => onDataChange({ companyNameAr: e.target.value })}
                placeholder="اسم شركتك"
                required
              />
            </div>

            <div>
              <Label htmlFor="industry">الصناعة/القطاع *</Label>
              <Select value={data.industry} onValueChange={(value) => onDataChange({ industry: value })}>
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
              <Select value={data.companySize} onValueChange={(value: any) => onDataChange({ companySize: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="عدد الموظفين" />
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
              <Label htmlFor="businessType">نوع العمل</Label>
              <Select value={data.businessType} onValueChange={(value: any) => onDataChange({ businessType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="نوع العملاء" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationCountry">البلد</Label>
              <Select value={data.locationCountry} onValueChange={(value) => onDataChange({ locationCountry: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر البلد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="السعودية">السعودية</SelectItem>
                  <SelectItem value="الإمارات">الإمارات</SelectItem>
                  <SelectItem value="الكويت">الكويت</SelectItem>
                  <SelectItem value="البحرين">البحرين</SelectItem>
                  <SelectItem value="قطر">قطر</SelectItem>
                  <SelectItem value="عمان">عمان</SelectItem>
                  <SelectItem value="أخرى">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationCity">المدينة</Label>
              <Input
                id="locationCity"
                value={data.locationCity}
                onChange={(e) => onDataChange({ locationCity: e.target.value })}
                placeholder="المدينة"
              />
            </div>

            <div>
              <Label htmlFor="yearsInBusiness">سنوات الخبرة</Label>
              <Select value={data.yearsInBusiness} onValueChange={(value: any) => onDataChange({ yearsInBusiness: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="كم سنة في السوق؟" />
                </SelectTrigger>
                <SelectContent>
                  {yearsOptions.map((years) => (
                    <SelectItem key={years} value={years}>
                      {years}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
