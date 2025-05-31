
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  CheckCircle,
  AlertTriangle,
  Info,
  Shield
} from 'lucide-react';

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  connected: boolean;
  permissions: {
    id: string;
    name: string;
    description: string;
    required: boolean;
    granted: boolean;
  }[];
}

interface SocialConnectStepProps {
  onNext: () => void;
  onBack: () => void;
}

export const SocialConnectStep = ({ onNext, onBack }: SocialConnectStepProps) => {
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      connected: false,
      permissions: [
        {
          id: 'pages_manage_posts',
          name: 'إدارة المنشورات',
          description: 'إنشاء ونشر المحتوى على صفحتك',
          required: true,
          granted: false
        },
        {
          id: 'pages_read_engagement',
          name: 'قراءة التفاعل',
          description: 'مراقبة الإعجابات والتعليقات والمشاركات',
          required: true,
          granted: false
        },
        {
          id: 'pages_show_list',
          name: 'عرض الصفحات',
          description: 'الوصول لقائمة صفحاتك',
          required: true,
          granted: false
        }
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      connected: false,
      permissions: [
        {
          id: 'instagram_basic',
          name: 'معلومات الحساب',
          description: 'الوصول لمعلومات الحساب الأساسية',
          required: true,
          granted: false
        },
        {
          id: 'instagram_content_publish',
          name: 'نشر المحتوى',
          description: 'نشر الصور والفيديوهات والقصص',
          required: true,
          granted: false
        }
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter (X)',
      icon: <Twitter className="w-6 h-6" />,
      color: 'text-black',
      bgColor: 'bg-gray-50',
      connected: false,
      permissions: [
        {
          id: 'tweet_write',
          name: 'نشر التغريدات',
          description: 'إنشاء ونشر التغريدات والردود',
          required: true,
          granted: false
        },
        {
          id: 'tweet_read',
          name: 'قراءة التغريدات',
          description: 'مراقبة التفاعل والإحصائيات',
          required: true,
          granted: false
        }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-6 h-6" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      connected: false,
      permissions: [
        {
          id: 'w_member_social',
          name: 'نشر المحتوى',
          description: 'نشر المقالات والمحتوى المهني',
          required: true,
          granted: false
        },
        {
          id: 'r_organization_social',
          name: 'إحصائيات الشركة',
          description: 'قراءة إحصائيات صفحة الشركة',
          required: false,
          granted: false
        }
      ]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      connected: false,
      permissions: [
        {
          id: 'youtube_upload',
          name: 'رفع الفيديوهات',
          description: 'رفع ونشر الفيديوهات على قناتك',
          required: false,
          granted: false
        },
        {
          id: 'youtube_readonly',
          name: 'قراءة الإحصائيات',
          description: 'مراقبة المشاهدات والتفاعل',
          required: false,
          granted: false
        }
      ]
    }
  ]);

  const handleConnect = async (platformId: string) => {
    // محاكاة عملية الربط
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    try {
      // هنا سيتم تطبيق OAuth الحقيقي
      console.log(`Connecting to ${platform.name}...`);
      
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // تحديث حالة المنصة
      setPlatforms(prev => prev.map(p => 
        p.id === platformId 
          ? { 
              ...p, 
              connected: true, 
              permissions: p.permissions.map(perm => ({ ...perm, granted: true }))
            }
          : p
      ));
    } catch (error) {
      console.error(`Error connecting to ${platform.name}:`, error);
    }
  };

  const handleDisconnect = (platformId: string) => {
    setPlatforms(prev => prev.map(p => 
      p.id === platformId 
        ? { 
            ...p, 
            connected: false, 
            permissions: p.permissions.map(perm => ({ ...perm, granted: false }))
          }
        : p
    ));
  };

  const connectedCount = platforms.filter(p => p.connected).length;
  const canProceed = connectedCount >= 1; // يحتاج منصة واحدة على الأقل

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ربط حسابات التواصل الاجتماعي</h2>
        <p className="text-gray-600">اربط حساباتك لبدء النشر التلقائي وجمع البيانات</p>
      </div>

      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center text-blue-800">
            <Info className="w-5 h-5 ml-2" />
            <span className="font-medium">لماذا نحتاج هذه الصلاحيات؟</span>
          </div>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• نشر المحتوى تلقائياً على منصاتك</li>
            <li>• جمع إحصائيات التفاعل والأداء</li>
            <li>• تحليل جمهورك وتفضيلاته</li>
            <li>• تحسين استراتيجيتك التسويقية</li>
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {platforms.map((platform) => (
          <Card key={platform.id} className="border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${platform.bgColor} ${platform.color}`}>
                    {platform.icon}
                  </div>
                  <div className="mr-3">
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    {platform.connected ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 ml-1" />
                        متصل
                      </Badge>
                    ) : (
                      <Badge variant="outline">غير متصل</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  {platform.connected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(platform.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      قطع الاتصال
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      className={`${platform.color.replace('text-', 'bg-').replace('600', '500')} hover:${platform.color.replace('text-', 'bg-').replace('600', '600')}`}
                    >
                      ربط الحساب
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 ml-2" />
                  <span>الصلاحيات المطلوبة:</span>
                </div>
                
                <div className="space-y-2">
                  {platform.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-sm">{permission.name}</span>
                          {permission.required && (
                            <Badge variant="secondary" className="mr-2 text-xs bg-orange-100 text-orange-800">
                              مطلوب
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
                      </div>
                      
                      <div className="flex items-center">
                        {permission.granted ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : permission.required ? (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-green-800 font-medium">
              تم ربط {connectedCount} من {platforms.length} منصات
            </p>
            {canProceed ? (
              <p className="text-sm text-green-700 mt-1">يمكنك المتابعة أو ربط المزيد من المنصات</p>
            ) : (
              <p className="text-sm text-green-700 mt-1">اربط منصة واحدة على الأقل للمتابعة</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          السابق
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          المتابعة ({connectedCount} منصات متصلة)
        </Button>
      </div>
    </div>
  );
};
