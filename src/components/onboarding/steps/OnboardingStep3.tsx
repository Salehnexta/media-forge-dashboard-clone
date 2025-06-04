
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Globe, Users, Plus, X } from 'lucide-react';
import { OnboardingData } from '../EnhancedSmartOnboarding';

interface OnboardingStep3Props {
  data: OnboardingData;
  onDataChange: (data: Partial<OnboardingData>) => void;
}

const primaryMarketsOptions = [
  'السعودية',
  'الإمارات', 
  'الكويت',
  'البحرين',
  'قطر',
  'عمان',
  'دول خليجية أخرى',
  'منطقة الشرق الأوسط'
];

const ageGroupsOptions = ['18-25', '26-35', '36-45', '46-55', '55+'];
const genderOptions = ['ذكور', 'إناث', 'كلاهما'];
const incomeLevelOptions = ['دخل منخفض', 'دخل متوسط', 'دخل عالي', 'جميع المستويات'];
const websitePlatformOptions = ['WordPress', 'Shopify', 'مخصص', 'Wix', 'أخرى'];

export const OnboardingStep3 = ({ data, onDataChange }: OnboardingStep3Props) => {
  const [newCity, setNewCity] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newCompetitor, setNewCompetitor] = useState({ name: '', website: '' });

  const handleMarketToggle = (market: string) => {
    const newMarkets = data.primaryMarkets.includes(market as any)
      ? data.primaryMarkets.filter(m => m !== market)
      : [...data.primaryMarkets, market as any];
    onDataChange({ primaryMarkets: newMarkets });
  };

  const handleAgeGroupToggle = (ageGroup: string) => {
    const newAgeGroups = data.targetAgeGroups.includes(ageGroup as any)
      ? data.targetAgeGroups.filter(a => a !== ageGroup)
      : [...data.targetAgeGroups, ageGroup as any];
    onDataChange({ targetAgeGroups: newAgeGroups });
  };

  const addCity = () => {
    if (newCity.trim()) {
      onDataChange({
        targetCities: [...data.targetCities, newCity.trim()]
      });
      setNewCity('');
    }
  };

  const removeCity = (cityToRemove: string) => {
    onDataChange({
      targetCities: data.targetCities.filter(city => city !== cityToRemove)
    });
  };

  const addTool = () => {
    if (newTool.trim()) {
      onDataChange({
        currentTools: [...data.currentTools, newTool.trim()]
      });
      setNewTool('');
    }
  };

  const removeTool = (toolToRemove: string) => {
    onDataChange({
      currentTools: data.currentTools.filter(tool => tool !== toolToRemove)
    });
  };

  const addCompetitor = () => {
    if (newCompetitor.name.trim()) {
      onDataChange({
        competitors: [...data.competitors, { ...newCompetitor }]
      });
      setNewCompetitor({ name: '', website: '' });
    }
  };

  const removeCompetitor = (index: number) => {
    onDataChange({
      competitors: data.competitors.filter((_, i) => i !== index)
    });
  };

  const handleSocialAccountChange = (platform: string, value: string) => {
    onDataChange({
      socialAccounts: {
        ...data.socialAccounts,
        [platform]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* السوق المستهدف */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            السوق المستهدف *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">الأسواق الأساسية</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {primaryMarketsOptions.map((market) => (
                <div key={market} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={market}
                    checked={data.primaryMarkets.includes(market as any)}
                    onCheckedChange={() => handleMarketToggle(market)}
                  />
                  <Label htmlFor={market} className="text-sm cursor-pointer">
                    {market}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">المدن المستهدفة</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                placeholder="اسم المدينة"
                onKeyPress={(e) => e.key === 'Enter' && addCity()}
              />
              <Button onClick={addCity} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {data.targetCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.targetCities.map((city) => (
                  <Badge key={city} variant="secondary" className="flex items-center gap-1">
                    {city}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeCity(city)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-base font-medium">الفئات العمرية</Label>
              <div className="space-y-2 mt-2">
                {ageGroupsOptions.map((ageGroup) => (
                  <div key={ageGroup} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={ageGroup}
                      checked={data.targetAgeGroups.includes(ageGroup as any)}
                      onCheckedChange={() => handleAgeGroupToggle(ageGroup)}
                    />
                    <Label htmlFor={ageGroup} className="text-sm cursor-pointer">
                      {ageGroup}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="targetGender">الجنس المستهدف</Label>
              <Select value={data.targetGender} onValueChange={(value: any) => onDataChange({ targetGender: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="incomeLevel">مستوى الدخل</Label>
              <Select value={data.incomeLevel} onValueChange={(value: any) => onDataChange({ incomeLevel: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {incomeLevelOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* الحضور الرقمي */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            الحضور الرقمي والمنافسون
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium mb-3 block">حسابات وسائل التواصل الاجتماعي</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data.socialAccounts).map(([platform, handle]) => (
                <div key={platform}>
                  <Label htmlFor={platform} className="capitalize">
                    {platform === 'instagram' ? 'إنستغرام' :
                     platform === 'twitter' ? 'تويتر' :
                     platform === 'linkedin' ? 'لينكدإن' :
                     platform === 'facebook' ? 'فيسبوك' :
                     platform === 'tiktok' ? 'تيك توك' :
                     platform === 'snapchat' ? 'سناب شات' :
                     platform === 'youtube' ? 'يوتيوب' : platform}
                  </Label>
                  <Input
                    id={platform}
                    value={handle}
                    onChange={(e) => handleSocialAccountChange(platform, e.target.value)}
                    placeholder={`@username أو رابط الحساب`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">المنافسون الرئيسيون</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              <Input
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({...newCompetitor, name: e.target.value})}
                placeholder="اسم المنافس"
              />
              <div className="flex gap-2">
                <Input
                  value={newCompetitor.website}
                  onChange={(e) => setNewCompetitor({...newCompetitor, website: e.target.value})}
                  placeholder="موقع المنافس (اختياري)"
                />
                <Button onClick={addCompetitor} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {data.competitors.length > 0 && (
              <div className="space-y-2 mt-3">
                {data.competitors.map((competitor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{competitor.name}</span>
                      {competitor.website && (
                        <span className="text-sm text-gray-600 mr-2">- {competitor.website}</span>
                      )}
                    </div>
                    <X 
                      className="w-4 h-4 cursor-pointer text-red-500" 
                      onClick={() => removeCompetitor(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="competitiveAdvantages">الميزة التنافسية</Label>
            <Textarea
              id="competitiveAdvantages"
              value={data.competitiveAdvantages}
              onChange={(e) => onDataChange({ competitiveAdvantages: e.target.value })}
              placeholder="ما الذي يميز شركتك عن المنافسين؟"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="websitePlatform">منصة الموقع الإلكتروني</Label>
              <Select value={data.websitePlatform} onValueChange={(value: any) => onDataChange({ websitePlatform: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {websitePlatformOptions.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium">الأدوات الحالية</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="اسم الأداة"
                  onKeyPress={(e) => e.key === 'Enter' && addTool()}
                />
                <Button onClick={addTool} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {data.currentTools.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.currentTools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                      {tool}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeTool(tool)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
