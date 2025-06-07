
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Globe, 
  Link, 
  Settings, 
  Check, 
  X, 
  Plus, 
  AlertCircle,
  Zap,
  Smartphone,
  Monitor,
  BarChart3,
  Mail,
  MessageCircle,
  Video,
  ShoppingCart,
  Calendar
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'social' | 'ads' | 'analytics' | 'email' | 'ecommerce' | 'crm';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  features: string[];
  isEnabled: boolean;
}

const integrations: Integration[] = [
  // Social Media
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'إدارة صفحات الفيسبوك والإعلانات',
    icon: '📘',
    category: 'social',
    status: 'connected',
    lastSync: 'منذ 5 دقائق',
    features: ['نشر المحتوى', 'إدارة الإعلانات', 'تحليل الأداء'],
    isEnabled: true
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'إدارة حساب انستغرام والقصص',
    icon: '📷',
    category: 'social',
    status: 'connected',
    lastSync: 'منذ 10 دقائق',
    features: ['نشر الصور', 'القصص', 'الريلز'],
    isEnabled: true
  },
  {
    id: 'twitter',
    name: 'Twitter',
    description: 'إدارة حساب تويتر والتغريدات',
    icon: '🐦',
    category: 'social',
    status: 'disconnected',
    features: ['نشر التغريدات', 'جدولة المحتوى', 'مراقبة المنشورات'],
    isEnabled: false
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'إدارة الملف المهني والشركة',
    icon: '💼',
    category: 'social',
    status: 'connected',
    lastSync: 'منذ ساعة',
    features: ['نشر المحتوى المهني', 'إدارة الشركة', 'التواصل'],
    isEnabled: true
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'إدارة حساب تيك توك والفيديوهات',
    icon: '🎵',
    category: 'social',
    status: 'error',
    lastSync: 'فشل المزامنة',
    features: ['نشر الفيديوهات', 'التحديات', 'التفاعل'],
    isEnabled: false
  },

  // Advertising
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'إدارة حملات إعلانات جوجل',
    icon: '🔍',
    category: 'ads',
    status: 'connected',
    lastSync: 'منذ 15 دقيقة',
    features: ['إعلانات البحث', 'شبكة المواقع', 'يوتيوب'],
    isEnabled: true
  },
  {
    id: 'snapchat-ads',
    name: 'Snapchat Ads',
    description: 'إعلانات سناب شات',
    icon: '👻',
    category: 'ads',
    status: 'disconnected',
    features: ['إعلانات القصص', 'الفلاتر المخصصة', 'الجمهور المستهدف'],
    isEnabled: false
  },

  // Analytics
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'تحليل زوار الموقع والأداء',
    icon: '📊',
    category: 'analytics',
    status: 'connected',
    lastSync: 'منذ 5 دقائق',
    features: ['تحليل الزوار', 'التحويلات', 'التقارير'],
    isEnabled: true
  },
  {
    id: 'hotjar',
    name: 'Hotjar',
    description: 'تحليل سلوك المستخدمين',
    icon: '🔥',
    category: 'analytics',
    status: 'disconnected',
    features: ['خرائط الحرارة', 'تسجيل الجلسات', 'الاستطلاعات'],
    isEnabled: false
  },

  // Email Marketing
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'إدارة حملات البريد الإلكتروني',
    icon: '📧',
    category: 'email',
    status: 'connected',
    lastSync: 'منذ 30 دقيقة',
    features: ['النشرات الإخبارية', 'الأتمتة', 'التقسيم'],
    isEnabled: true
  },

  // E-commerce
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'متجرك الإلكتروني',
    icon: '🛒',
    category: 'ecommerce',
    status: 'disconnected',
    features: ['إدارة المنتجات', 'الطلبات', 'التقارير'],
    isEnabled: false
  },

  // CRM
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'إدارة علاقات العملاء',
    icon: '🤝',
    category: 'crm',
    status: 'disconnected',
    features: ['إدارة جهات الاتصال', 'تتبع المبيعات', 'التقارير'],
    isEnabled: false
  }
];

const categories = [
  { id: 'all', name: 'الكل', icon: Globe },
  { id: 'social', name: 'وسائل التواصل', icon: Smartphone },
  { id: 'ads', name: 'الإعلانات', icon: Monitor },
  { id: 'analytics', name: 'التحليلات', icon: BarChart3 },
  { id: 'email', name: 'البريد الإلكتروني', icon: Mail },
  { id: 'ecommerce', name: 'التجارة الإلكترونية', icon: ShoppingCart },
  { id: 'crm', name: 'إدارة العملاء', icon: MessageCircle }
];

export const IntegrationManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="w-4 h-4" />;
      case 'error': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected': return 'متصل';
      case 'error': return 'خطأ';
      default: return 'غير متصل';
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const totalCount = integrations.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">مدير التكاملات</h2>
          <p className="text-gray-600 mt-1">ربط منصاتك المفضلة لتجربة موحدة</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">التكاملات المتصلة</p>
            <p className="text-lg font-semibold text-gray-900">{connectedCount} / {totalCount}</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            إضافة تكامل
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">متصل</p>
                <p className="text-xl font-bold text-gray-900">{connectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">غير متصل</p>
                <p className="text-xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'disconnected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">أخطاء</p>
                <p className="text-xl font-bold text-gray-900">
                  {integrations.filter(i => i.status === 'error').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">نشط</p>
                <p className="text-xl font-bold text-gray-900">
                  {integrations.filter(i => i.isEnabled).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="البحث في التكاملات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-full ${getStatusColor(integration.status)} text-white`}>
                    {getStatusIcon(integration.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">الحالة:</span>
                <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                  {getStatusLabel(integration.status)}
                </Badge>
              </div>

              {/* Last Sync */}
              {integration.lastSync && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">آخر مزامنة:</span>
                  <span className="text-sm text-gray-600">{integration.lastSync}</span>
                </div>
              )}

              {/* Features */}
              <div>
                <p className="text-sm font-medium mb-2">الميزات:</p>
                <div className="flex flex-wrap gap-1">
                  {integration.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {integration.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{integration.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Enable/Disable Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">مفعل:</span>
                <Switch
                  checked={integration.isEnabled}
                  disabled={integration.status !== 'connected'}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {integration.status === 'connected' ? (
                  <>
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <Settings className="w-3 h-3" />
                      إعدادات
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1">
                      <X className="w-3 h-3" />
                      قطع الاتصال
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="w-full gap-1">
                    <Link className="w-3 h-3" />
                    ربط الآن
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد تكاملات</h3>
          <p className="text-gray-600">جرب البحث بكلمات أخرى أو اختر فئة مختلفة</p>
        </div>
      )}
    </div>
  );
};
