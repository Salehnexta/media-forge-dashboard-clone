
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { InputSanitizer } from './InputSanitizer';
import { formRateLimiter } from './RateLimiter';

interface PaymentFormData {
  amount: number;
  currency: string;
  description: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

interface SecurePaymentFormProps {
  onPaymentSubmit: (data: PaymentFormData) => Promise<void>;
  loading?: boolean;
}

export const SecurePaymentForm: React.FC<SecurePaymentFormProps> = ({
  onPaymentSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: 0,
    currency: 'SAR',
    description: '',
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Amount validation
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'يرجى إدخال مبلغ صحيح';
    } else if (formData.amount > 100000) {
      newErrors.amount = 'المبلغ كبير جداً';
    }

    // Customer info validation
    if (!formData.customerInfo.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    } else if (formData.customerInfo.name.length > 100) {
      newErrors.name = 'الاسم طويل جداً';
    }

    if (!InputSanitizer.validateEmail(formData.customerInfo.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!InputSanitizer.validatePhone(formData.customerInfo.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }

    // Description validation
    if (formData.description.length > 500) {
      newErrors.description = 'الوصف طويل جداً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limiting check
    if (!formRateLimiter.isAllowed()) {
      toast.error('تم إرسال طلبات كثيرة. يرجى المحاولة لاحقاً.');
      return;
    }

    if (!validateForm()) {
      toast.error('يرجى تصحيح الأخطاء أولاً');
      return;
    }

    try {
      // Sanitize form data before submission
      const sanitizedData: PaymentFormData = {
        amount: Math.round(formData.amount * 100) / 100, // Round to 2 decimals
        currency: formData.currency,
        description: InputSanitizer.sanitizeText(formData.description),
        customerInfo: {
          name: InputSanitizer.sanitizeText(formData.customerInfo.name),
          email: formData.customerInfo.email.toLowerCase().trim(),
          phone: formData.customerInfo.phone.replace(/\s/g, '')
        }
      };

      await onPaymentSubmit(sanitizedData);
      toast.success('تم إرسال طلب الدفع بنجاح');
      
      // Reset form
      setFormData({
        amount: 0,
        currency: 'SAR',
        description: '',
        customerInfo: { name: '', email: '', phone: '' }
      });
    } catch (error) {
      console.error('Payment submission error:', error);
      toast.error('حدث خطأ أثناء معالجة الدفع');
    }
  };

  const updateCustomerInfo = (field: keyof PaymentFormData['customerInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>معلومات الدفع</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">المبلغ *</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              max="100000"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }));
                if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
              }}
              className={errors.amount ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <Label htmlFor="name">الاسم الكامل *</Label>
            <Input
              id="name"
              type="text"
              maxLength={100}
              value={formData.customerInfo.name}
              onChange={(e) => updateCustomerInfo('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              maxLength={254}
              value={formData.customerInfo.email}
              onChange={(e) => updateCustomerInfo('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              type="tel"
              maxLength={20}
              value={formData.customerInfo.phone}
              onChange={(e) => updateCustomerInfo('phone', e.target.value)}
              className={errors.phone ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <Label htmlFor="description">وصف الدفع (اختياري)</Label>
            <Input
              id="description"
              type="text"
              maxLength={500}
              value={formData.description}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, description: e.target.value }));
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              className={errors.description ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'جاري المعالجة...' : 'متابعة الدفع'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
