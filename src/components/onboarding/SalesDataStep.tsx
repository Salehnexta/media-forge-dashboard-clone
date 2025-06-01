
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Target, DollarSign, X } from 'lucide-react';

interface SalesData {
  annual_revenue: string;
  monthly_average_sales: string;
  top_selling_products: string[];
  sales_channels: string[];
  customer_acquisition_cost: string;
  customer_lifetime_value: string;
  conversion_rate: string;
  sales_team_size: string;
  sales_process_description: string;
}

interface SalesDataStepProps {
  salesData: SalesData;
  onSalesDataChange: (data: SalesData) => void;
}

const salesChannelOptions = [
  'المبيعات المباشرة',
  'التجارة الإلكترونية', 
  'وسائل التواصل الاجتماعي',
  'المعارض التجارية',
  'الشراكات',
  'البيع بالتجزئة',
  'المبيعات عبر الهاتف',
  'التسويق الرقمي'
];

export const SalesDataStep = ({ salesData, onSalesDataChange }: SalesDataStepProps) => {
  const [newProduct, setNewProduct] = useState('');
  const [newChannel, setNewChannel] = useState('');

  const handleInputChange = (field: keyof SalesData, value: string) => {
    onSalesDataChange({ ...salesData, [field]: value });
  };

  const addProduct = () => {
    if (newProduct.trim()) {
      const updatedProducts = [...salesData.top_selling_products, newProduct.trim()];
      onSalesDataChange({ ...salesData, top_selling_products: updatedProducts });
      setNewProduct('');
    }
  };

  const removeProduct = (index: number) => {
    const updatedProducts = salesData.top_selling_products.filter((_, i) => i !== index);
    onSalesDataChange({ ...salesData, top_selling_products: updatedProducts });
  };

  const addChannel = (channel: string) => {
    if (!salesData.sales_channels.includes(channel)) {
      const updatedChannels = [...salesData.sales_channels, channel];
      onSalesDataChange({ ...salesData, sales_channels: updatedChannels });
    }
  };

  const removeChannel = (channel: string) => {
    const updatedChannels = salesData.sales_channels.filter(c => c !== channel);
    onSalesDataChange({ ...salesData, sales_channels: updatedChannels });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">بيانات المبيعات</h2>
        <p className="text-gray-600">ساعدنا في فهم أداء مبيعاتك الحالي لوضع استراتيجية أفضل</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="w-5 h-5 ml-2" />
              الإيرادات والمبيعات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="annual_revenue">الإيراد السنوي (ريال سعودي)</Label>
              <Input
                id="annual_revenue"
                type="number"
                value={salesData.annual_revenue}
                onChange={(e) => handleInputChange('annual_revenue', e.target.value)}
                placeholder="1000000"
              />
            </div>
            
            <div>
              <Label htmlFor="monthly_average_sales">متوسط المبيعات الشهرية (ريال سعودي)</Label>
              <Input
                id="monthly_average_sales"
                type="number"
                value={salesData.monthly_average_sales}
                onChange={(e) => handleInputChange('monthly_average_sales', e.target.value)}
                placeholder="100000"
              />
            </div>

            <div>
              <Label htmlFor="conversion_rate">معدل التحويل (%)</Label>
              <Input
                id="conversion_rate"
                type="number"
                step="0.01"
                value={salesData.conversion_rate}
                onChange={(e) => handleInputChange('conversion_rate', e.target.value)}
                placeholder="2.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 ml-2" />
              تكلفة العملاء
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer_acquisition_cost">تكلفة اكتساب العميل (ريال سعودي)</Label>
              <Input
                id="customer_acquisition_cost"
                type="number"
                value={salesData.customer_acquisition_cost}
                onChange={(e) => handleInputChange('customer_acquisition_cost', e.target.value)}
                placeholder="500"
              />
            </div>
            
            <div>
              <Label htmlFor="customer_lifetime_value">القيمة الحياتية للعميل (ريال سعودي)</Label>
              <Input
                id="customer_lifetime_value"
                type="number"
                value={salesData.customer_lifetime_value}
                onChange={(e) => handleInputChange('customer_lifetime_value', e.target.value)}
                placeholder="5000"
              />
            </div>

            <div>
              <Label htmlFor="sales_team_size">حجم فريق المبيعات</Label>
              <Input
                id="sales_team_size"
                type="number"
                value={salesData.sales_team_size}
                onChange={(e) => handleInputChange('sales_team_size', e.target.value)}
                placeholder="5"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="أضف منتج أو خدمة..."
              onKeyPress={(e) => e.key === 'Enter' && addProduct()}
            />
            <Button onClick={addProduct} variant="outline">إضافة</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {salesData.top_selling_products.map((product, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {product}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeProduct(index)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>قنوات المبيعات</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>اختر قنوات المبيعات المستخدمة:</Label>
            <Select onValueChange={addChannel}>
              <SelectTrigger>
                <SelectValue placeholder="اختر قناة مبيعات" />
              </SelectTrigger>
              <SelectContent>
                {salesChannelOptions.map((channel) => (
                  <SelectItem 
                    key={channel} 
                    value={channel}
                    disabled={salesData.sales_channels.includes(channel)}
                  >
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {salesData.sales_channels.map((channel) => (
              <Badge key={channel} variant="default" className="flex items-center gap-1">
                {channel}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeChannel(channel)}
                />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 ml-2" />
            عملية البيع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="sales_process_description">وصف عملية البيع الحالية</Label>
            <Textarea
              id="sales_process_description"
              value={salesData.sales_process_description}
              onChange={(e) => handleInputChange('sales_process_description', e.target.value)}
              placeholder="صف كيف تتم عملية البيع في شركتك من البداية حتى إتمام الصفقة..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
