
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface RegistrationFormData {
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  jobTitle: string;
  languagePreference: 'ar' | 'en' | 'both';
  termsAccepted: boolean;
  marketingConsent: boolean;
}

export const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullNameAr: '',
    fullNameEn: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    jobTitle: '',
    languagePreference: 'ar',
    termsAccepted: false,
    marketingConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast.error('يجب الموافقة على الشروط والأحكام');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name_ar: formData.fullNameAr,
            full_name_en: formData.fullNameEn,
            mobile_number: formData.mobileNumber,
            job_title: formData.jobTitle,
            language_preference: formData.languagePreference,
            marketing_consent: formData.marketingConsent.toString(),
          },
        },
      });

      if (error) {
        toast.error('حدث خطأ أثناء التسجيل: ' + error.message);
        return;
      }

      if (data.user) {
        toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني');
        navigate('/onboarding');
      }
    } catch (error) {
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white border border-slate-200 shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">إنشاء حساب جديد</CardTitle>
          <CardDescription className="text-slate-600">انضم إلى منصة مورفو للتسويق الذكي</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="fullNameAr" className="text-slate-700">الاسم بالعربية</Label>
                <Input
                  id="fullNameAr"
                  type="text"
                  value={formData.fullNameAr}
                  onChange={(e) => updateFormData('fullNameAr', e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-600"
                  required
                  dir="rtl"
                />
              </div>
              
              <div>
                <Label htmlFor="fullNameEn" className="text-slate-700">الاسم بالإنجليزية</Label>
                <Input
                  id="fullNameEn"
                  type="text"
                  value={formData.fullNameEn}
                  onChange={(e) => updateFormData('fullNameEn', e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-700">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="bg-slate-50 border-slate-300 focus:border-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="password" className="text-slate-700">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-600"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-slate-700">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="bg-slate-50 border-slate-300 focus:border-blue-600"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mobileNumber" className="text-slate-700">رقم الجوال</Label>
              <Input
                id="mobileNumber"
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => updateFormData('mobileNumber', e.target.value)}
                className="bg-slate-50 border-slate-300 focus:border-blue-600"
                placeholder="+966xxxxxxxxx"
              />
            </div>

            <div>
              <Label htmlFor="jobTitle" className="text-slate-700">المسمى الوظيفي</Label>
              <Input
                id="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => updateFormData('jobTitle', e.target.value)}
                className="bg-slate-50 border-slate-300 focus:border-blue-600"
              />
            </div>

            <div>
              <Label htmlFor="languagePreference" className="text-slate-700">اللغة المفضلة</Label>
              <Select value={formData.languagePreference} onValueChange={(value) => updateFormData('languagePreference', value)}>
                <SelectTrigger className="bg-slate-50 border-slate-300 focus:border-blue-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="both">كلاهما / Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData('termsAccepted', checked)}
                  className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="terms" className="text-sm text-slate-700">
                  أوافق على <span className="text-blue-600 underline">الشروط والأحكام</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="marketing"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => updateFormData('marketingConsent', checked)}
                  className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="marketing" className="text-sm text-slate-600">
                  أرغب في تلقي عروض ونصائح تسويقية
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5"
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              لديك حساب بالفعل؟{' '}
              <span className="text-blue-600 cursor-pointer hover:underline">
                تسجيل الدخول
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
