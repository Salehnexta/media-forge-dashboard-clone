
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeOff, Check, X } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const [errors, setErrors] = useState<Partial<RegistrationFormData>>({});

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isStrong: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const validateForm = () => {
    const newErrors: Partial<RegistrationFormData> = {};

    if (!formData.fullNameAr.trim()) newErrors.fullNameAr = 'الاسم بالعربية مطلوب';
    if (!formData.fullNameEn.trim()) newErrors.fullNameEn = 'English name is required';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!passwordValidation.isStrong) newErrors.password = 'كلمة المرور ضعيفة';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    }
    if (!formData.termsAccepted) newErrors.termsAccepted = 'يجب الموافقة على الشروط والأحكام';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            full_name_ar: formData.fullNameAr,
            full_name_en: formData.fullNameEn,
            mobile_number: formData.mobileNumber,
            job_title: formData.jobTitle,
            language_preference: formData.languagePreference,
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success('تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني');
        navigate('/onboarding');
      }
    } catch (error: any) {
      toast.error('حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-50 border-slate-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            إنشاء حساب في مورفو
          </CardTitle>
          <p className="text-slate-600">انضم إلى منصة التسويق الذكي</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullNameAr">الاسم الكامل (بالعربية) *</Label>
                <Input
                  id="fullNameAr"
                  value={formData.fullNameAr}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullNameAr: e.target.value }))}
                  placeholder="أدخل اسمك الكامل بالعربية"
                  className={errors.fullNameAr ? 'border-red-500' : ''}
                />
                {errors.fullNameAr && <p className="text-red-500 text-sm mt-1">{errors.fullNameAr}</p>}
              </div>
              
              <div>
                <Label htmlFor="fullNameEn">Full Name (English) *</Label>
                <Input
                  id="fullNameEn"
                  value={formData.fullNameEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullNameEn: e.target.value }))}
                  placeholder="Enter your full name in English"
                  className={errors.fullNameEn ? 'border-red-500' : ''}
                />
                {errors.fullNameEn && <p className="text-red-500 text-sm mt-1">{errors.fullNameEn}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">كلمة المرور *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="أدخل كلمة مرور قوية"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-xs">
                      {passwordValidation.hasMinLength ? 
                        <Check className="h-3 w-3 text-green-500 ml-1" /> : 
                        <X className="h-3 w-3 text-red-500 ml-1" />
                      }
                      <span>8 أحرف على الأقل</span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordValidation.hasUpperCase ? 
                        <Check className="h-3 w-3 text-green-500 ml-1" /> : 
                        <X className="h-3 w-3 text-red-500 ml-1" />
                      }
                      <span>حرف كبير</span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordValidation.hasNumbers ? 
                        <Check className="h-3 w-3 text-green-500 ml-1" /> : 
                        <X className="h-3 w-3 text-red-500 ml-1" />
                      }
                      <span>رقم</span>
                    </div>
                    <div className="flex items-center text-xs">
                      {passwordValidation.hasSpecialChar ? 
                        <Check className="h-3 w-3 text-green-500 ml-1" /> : 
                        <X className="h-3 w-3 text-red-500 ml-1" />
                      }
                      <span>رمز خاص</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="أعد إدخال كلمة المرور"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mobileNumber">رقم الجوال</Label>
                <Input
                  id="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  placeholder="+966 50 123 4567"
                />
              </div>
              
              <div>
                <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="مدير التسويق"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="languagePreference">اللغة المفضلة</Label>
              <Select value={formData.languagePreference} onValueChange={(value: 'ar' | 'en' | 'both') => setFormData(prev => ({ ...prev, languagePreference: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="both">كلاهما / Both</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2 space-x-reverse">
                <Checkbox
                  id="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))}
                  className={errors.termsAccepted ? 'border-red-500' : ''}
                />
                <Label htmlFor="termsAccepted" className="text-sm leading-none">
                  أوافق على <a href="/terms" className="text-blue-600 hover:underline">الشروط والأحكام</a> و<a href="/privacy" className="text-blue-600 hover:underline">سياسة الخصوصية</a> *
                </Label>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
              
              <div className="flex items-start space-x-2 space-x-reverse">
                <Checkbox
                  id="marketingConsent"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, marketingConsent: !!checked }))}
                />
                <Label htmlFor="marketingConsent" className="text-sm leading-none">
                  أرغب في تلقي النشرات الإخبارية والعروض التسويقية
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              لديك حساب بالفعل؟{' '}
              <button 
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:underline font-medium"
              >
                تسجيل الدخول
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
