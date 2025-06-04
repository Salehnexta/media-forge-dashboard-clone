
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from 'lucide-react';

interface CompanyData {
  name: string;
  industry: string;
  description: string;
  website: string;
  size: string;
  location: string;
  founded: string;
}

interface AdditionalInfoStepProps {
  companyData: CompanyData;
  onInputChange: (field: keyof CompanyData, value: string) => void;
}

const companySizes = [
  'مؤسسة فردية (1 شخص)',
  'شركة صغيرة (2-10 أشخاص)',
  'شركة متوسطة (11-50 شخص)',
  'شركة كبيرة (51-200 شخص)',
  'شركة كبيرة جداً (أكثر من 200 شخص)'
];

export const AdditionalInfoStep = ({ companyData, onInputChange }: AdditionalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">معلومات إضافية</h2>
        <p className="text-gray-600">هذه المعلومات ستساعدنا في تقديم تحليل أكثر دقة</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="website">الموقع الإلكتروني</Label>
          <Input
            id="website"
            value={companyData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="https://example.com"
            type="url"
          />
        </div>
        
        <div>
          <Label htmlFor="size">حجم الشركة</Label>
          <Select value={companyData.size} onValueChange={(value) => onInputChange('size', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر حجم الشركة" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">الموقع</Label>
            <Input
              id="location"
              value={companyData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
              placeholder="المدينة، البلد"
            />
          </div>
          
          <div>
            <Label htmlFor="founded">سنة التأسيس</Label>
            <Input
              id="founded"
              value={companyData.founded}
              onChange={(e) => onInputChange('founded', e.target.value)}
              placeholder="2024"
              type="number"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
