
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface CompanyData {
  name: string;
  industry: string;
  description: string;
  website: string;
  size: string;
  location: string;
  founded: string;
}

interface CompanyInfoStepProps {
  companyData: CompanyData;
  onInputChange: (field: keyof CompanyData, value: string) => void;
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
  'مؤسسة فردية (1 شخص)',
  'شركة صغيرة (2-10 أشخاص)',
  'شركة متوسطة (11-50 شخص)',
  'شركة كبيرة (51-200 شخص)',
  'شركة كبيرة جداً (أكثر من 200 شخص)'
];

export const CompanyInfoStep = ({ companyData, onInputChange }: CompanyInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات الشركة الأساسية</h2>
        <p className="text-gray-600">دعنا نتعرف على شركتك لنقدم لك أفضل الخدمات</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">اسم الشركة *</Label>
          <Input
            id="name"
            value={companyData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="اسم شركتك"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="industry">الصناعة *</Label>
          <Select value={companyData.industry} onValueChange={(value) => onInputChange('industry', value)}>
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
          <Label htmlFor="description">وصف الشركة</Label>
          <Textarea
            id="description"
            value={companyData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="صف نشاط شركتك والخدمات التي تقدمها"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};
