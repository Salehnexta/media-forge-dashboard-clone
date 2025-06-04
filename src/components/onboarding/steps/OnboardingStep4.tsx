
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { FileText, MessageSquare, Palette, Shield, Zap } from 'lucide-react';
import { OnboardingData } from '../EnhancedSmartOnboarding';

interface OnboardingStep4Props {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
}

const contentTypesOptions = [
  'مقالات المدونة',
  'منشورات وسائل التواصل',
  'فيديوهات',
  'إنفوجرافيك',
  'دراسات حالة',
  'نشرات إخبارية',
  'ندوات عبر الإنترنت'
];

const preferredChannelsOptions = [
  'وسائل التواصل الاجتماعي',
  'تحسين محركات البحث',
  'إعلانات جوجل',
  'التسويق عبر البريد الإلكتروني',
  'تسويق المحتوى',
  'التسويق عبر المؤثرين',
  'التسويق بالفيديو'
];

const brandPersonalityOptions = ['مهني', 'ودود', 'موثوق', 'إبداعي', 'تقليدي', 'عصري'];
const communicationToneOptions = ['رسمي', 'شبه رسمي', 'محادثة', 'مرح'];
const subscriptionPlanOptions = ['المبتدئ', 'المحترف', 'المؤسسة'];

export const OnboardingStep4 = ({ data, onDataChange }: OnboardingStep4Props) => {
  const handleContentTypeToggle = (contentType: string) => {
    const newContentTypes = data.contentTypes.includes(contentType as any)
      ? data.contentTypes.filter(c => c !== contentType)
      : [...data.contentTypes, contentType as any];
    onDataChange({ contentTypes: newContentTypes });
  };

  const handleChannelToggle = (channel: string) => {
    const newChannels = data.preferredChannels.includes(channel as any)
      ? data.preferredChannels.filter(c => c !== channel)
      : [...data.preferredChannels, channel as any];
    onDataChange({ preferredChannels: newChannels });
  };

  return (
    <div className="space-y-6">
      {/* تفضيلات المحتوى */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            تفضيلات المحتوى
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contentLanguages">لغات المحتوى</Label>
              <Select value={data.contentLanguages} onValueChange={(value: any) => onDataChange({ contentLanguages: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="عربي فقط">عربي فقط</SelectItem>
                  <SelectItem value="عربي وإنجليزي">عربي وإنجليزي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brandPersonality">شخصية العلامة التجارية</Label>
              <Select value={data.brandPersonality} onValueChange={(value: any) => onDataChange({ brandPersonality: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brandPersonalityOptions.map((personality) => (
                    <SelectItem key={personality} value={personality}>
                      {personality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="communicationTone">نبرة التواصل</Label>
            <Select value={data.communicationTone} onValueChange={(value: any) => onDataChange({ communicationTone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {communicationToneOptions.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-base font-medium">أنواع المحتوى المطلوبة</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {contentTypesOptions.map((contentType) => (
                <div key={contentType} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={contentType}
                    checked={data.contentTypes.includes(contentType as any)}
                    onCheckedChange={() => handleContentTypeToggle(contentType)}
                  />
                  <Label htmlFor={contentType} className="text-sm cursor-pointer">
                    {contentType}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قنوات التسويق */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            قنوات التسويق المفضلة *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preferredChannelsOptions.map((channel) => (
              <div key={channel} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={channel}
                  checked={data.preferredChannels.includes(channel as any)}
                  onCheckedChange={() => handleChannelToggle(channel)}
                />
                <Label htmlFor={channel} className="text-sm cursor-pointer">
                  {channel}
                </Label>
              </div>
            ))}
          </div>

          {data.preferredChannels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">القنوات المختارة:</span>
              {data.preferredChannels.map((channel) => (
                <Badge key={channel} variant="secondary" className="text-xs">
                  {channel}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* الخصوصية والإعدادات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            الخصوصية والإعدادات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analyticsConsent" className="text-base font-medium">
                  موافقة على تتبع الإحصائيات
                </Label>
                <p className="text-sm text-gray-600">السماح بجمع بيانات الأداء لتحسين الخدمة</p>
              </div>
              <Switch
                id="analyticsConsent"
                checked={data.analyticsConsent}
                onCheckedChange={(checked) => onDataChange({ analyticsConsent: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trackingConsent" className="text-base font-medium">
                  موافقة على تتبع السلوك
                </Label>
                <p className="text-sm text-gray-600">تتبع تفاعلات المستخدمين لتحسين التوصيات</p>
              </div>
              <Switch
                id="trackingConsent"
                checked={data.trackingConsent}
                onCheckedChange={(checked) => onDataChange({ trackingConsent: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dataPrivacyConsent" className="text-base font-medium">
                  موافقة على سياسة الخصوصية *
                </Label>
                <p className="text-sm text-gray-600">الموافقة على شروط الاستخدام وسياسة الخصوصية</p>
              </div>
              <Switch
                id="dataPrivacyConsent"
                checked={data.dataPrivacyConsent}
                onCheckedChange={(checked) => onDataChange({ dataPrivacyConsent: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الخطة والبدء */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            الخطة والبدء
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subscriptionPlan">خطة الاشتراك</Label>
            <Select value={data.subscriptionPlan} onValueChange={(value: any) => onDataChange({ subscriptionPlan: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subscriptionPlanOptions.map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {plan}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="immediateStart" className="text-base font-medium">
                  البدء فوراً
                </Label>
                <p className="text-sm text-gray-600">بدء إنشاء المحتوى والحملات مباشرة</p>
              </div>
              <Switch
                id="immediateStart"
                checked={data.immediateStart}
                onCheckedChange={(checked) => onDataChange({ immediateStart: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="onboardingCall" className="text-base font-medium">
                  جلسة إعداد مع الفريق
                </Label>
                <p className="text-sm text-gray-600">حجز جلسة لمناقشة استراتيجيتك مع خبير</p>
              </div>
              <Switch
                id="onboardingCall"
                checked={data.onboardingCall}
                onCheckedChange={(checked) => onDataChange({ onboardingCall: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!data.dataPrivacyConsent && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            ⚠️ يجب الموافقة على سياسة الخصوصية لإكمال عملية التسجيل
          </p>
        </div>
      )}
    </div>
  );
};
