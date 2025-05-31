
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock } from 'lucide-react';

interface PaymentFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export const PaymentForm = ({ onSubmit, loading }: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: ''
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          بيانات البطاقة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cardName">اسم حامل البطاقة</Label>
            <Input
              id="cardName"
              value={formData.cardName}
              onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
              placeholder="الاسم كما هو مكتوب على البطاقة"
              required
            />
          </div>

          <div>
            <Label htmlFor="cardNumber">رقم البطاقة</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">الشهر</Label>
              <Input
                id="expiryMonth"
                value={formData.expiryMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                placeholder="MM"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="expiryYear">السنة</Label>
              <Input
                id="expiryYear"
                value={formData.expiryYear}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryYear: e.target.value }))}
                placeholder="YY"
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                value={formData.cvc}
                onChange={(e) => setFormData(prev => ({ ...prev, cvc: e.target.value }))}
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              جميع المعاملات محمية بتشفير SSL آمن
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'جاري المعالجة...' : 'إتمام الدفع'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
