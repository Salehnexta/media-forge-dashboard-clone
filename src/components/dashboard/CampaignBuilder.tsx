
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Megaphone, 
  Target, 
  DollarSign, 
  Calendar as CalendarIcon, 
  Settings, 
  Eye, 
  Play,
  Pause,
  BarChart3,
  Globe,
  Smartphone,
  Monitor,
  Users,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platform: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: Date;
  endDate: Date;
}

const platforms = [
  { id: 'google', name: 'Google Ads', icon: '🔍' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' }
];

const sampleCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'حملة المنتجات الجديدة',
    status: 'active',
    platform: 'facebook',
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 3750,
    conversions: 45,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  },
  {
    id: '2',
    name: 'العروض الصيفية',
    status: 'active',
    platform: 'google',
    budget: 8000,
    spent: 4500,
    impressions: 89000,
    clicks: 2670,
    conversions: 32,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15')
  },
  {
    id: '3',
    name: 'زيادة الوعي بالعلامة التجارية',
    status: 'paused',
    platform: 'instagram',
    budget: 3000,
    spent: 1200,
    impressions: 67000,
    clicks: 1340,
    conversions: 18,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-02-10')
  }
];

export const CampaignBuilder = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    platform: '',
    budget: '',
    description: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'paused': return 'متوقفة';
      case 'completed': return 'مكتملة';
      default: return 'مسودة';
    }
  };

  const getPlatformInfo = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || { name: platformId, icon: '🌐' };
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.platform || !newCampaign.budget) return;

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      status: 'draft',
      platform: newCampaign.platform,
      budget: parseInt(newCampaign.budget),
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      startDate: newCampaign.startDate || new Date(),
      endDate: newCampaign.endDate || new Date()
    };

    setCampaigns(prev => [...prev, campaign]);
    setNewCampaign({
      name: '',
      platform: '',
      budget: '',
      description: '',
      startDate: undefined,
      endDate: undefined
    });
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">إنشاء حملة جديدة</h2>
          <Button variant="outline" onClick={() => setIsCreating(false)}>
            إلغاء
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              تفاصيل الحملة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">اسم الحملة</label>
                  <Input
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="مثال: حملة المنتجات الجديدة"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">المنصة</label>
                  <Select
                    value={newCampaign.platform}
                    onValueChange={(value) => setNewCampaign(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="اختر المنصة" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          <div className="flex items-center gap-2">
                            <span>{platform.icon}</span>
                            <span>{platform.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">الميزانية (ر.س)</label>
                  <Input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="5000"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ البداية</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full mt-1 justify-start text-right">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {newCampaign.startDate ? format(newCampaign.startDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCampaign.startDate}
                        onSelect={(date) => setNewCampaign(prev => ({ ...prev, startDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">تاريخ النهاية</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full mt-1 justify-start text-right">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {newCampaign.endDate ? format(newCampaign.endDate, 'PPP', { locale: ar }) : 'اختر التاريخ'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCampaign.endDate}
                        onSelect={(date) => setNewCampaign(prev => ({ ...prev, endDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">الوصف</label>
                  <Textarea
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف مختصر للحملة وأهدافها"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                إلغاء
              </Button>
              <Button onClick={handleCreateCampaign}>
                إنشاء الحملة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">منشئ الحملات</h2>
          <p className="text-gray-600 mt-1">إنشاء وإدارة الحملات الإعلانية</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Megaphone className="w-4 h-4" />
          حملة جديدة
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => {
          const platform = getPlatformInfo(campaign.platform);
          const ctr = campaign.impressions > 0 ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2) : '0';
          const conversionRate = campaign.clicks > 0 ? ((campaign.conversions / campaign.clicks) * 100).toFixed(2) : '0';

          return (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{platform.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600">{platform.name}</p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                    {getStatusLabel(campaign.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Budget Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>الميزانية المستخدمة</span>
                    <span>{campaign.spent.toLocaleString()} / {campaign.budget.toLocaleString()} ر.س</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="font-semibold text-blue-600">{campaign.impressions.toLocaleString()}</p>
                    <p className="text-gray-600">مشاهدات</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="font-semibold text-green-600">{campaign.clicks.toLocaleString()}</p>
                    <p className="text-gray-600">نقرات</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="font-semibold text-purple-600">{ctr}%</p>
                    <p className="text-gray-600">معدل النقر</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <p className="font-semibold text-orange-600">{campaign.conversions}</p>
                    <p className="text-gray-600">تحويلات</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Eye className="w-3 h-3" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    {campaign.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    {campaign.status === 'active' ? 'إيقاف' : 'تشغيل'}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <Settings className="w-3 h-3" />
                    تعديل
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            ملخص الأداء العام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {campaigns.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">إجمالي الميزانية (ر.س)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {campaigns.reduce((sum, c) => sum + c.impressions, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">إجمالي المشاهدات</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {campaigns.reduce((sum, c) => sum + c.clicks, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">إجمالي النقرات</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {campaigns.reduce((sum, c) => sum + c.conversions, 0)}
              </p>
              <p className="text-gray-600">إجمالي التحويلات</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
