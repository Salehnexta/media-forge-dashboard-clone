
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  Loader2, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Unplug
} from 'lucide-react';
import { Platform, PlatformConnectionResult, platformIntegration } from '@/services/PlatformIntegration';
import { toast } from 'sonner';

interface PlatformSelectorProps {
  className?: string;
}

export const PlatformSelector = ({ className = '' }: PlatformSelectorProps) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectingPlatforms, setConnectingPlatforms] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setIsLoading(true);
    try {
      const data = await platformIntegration.getAvailablePlatforms();
      if (data) {
        // Update connection status from the integration manager
        const updatedPlatforms = data.platforms.map(platform => ({
          ...platform,
          is_connected: platformIntegration.isPlatformConnected(platform.id),
          connection_status: platformIntegration.getConnectionStatus(platform.id) as any
        }));
        setPlatforms(updatedPlatforms);
      }
    } catch (error) {
      console.error('Error fetching platforms:', error);
      toast.error('فشل في جلب قائمة المنصات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectPlatform = async (platformId: string) => {
    setConnectingPlatforms(prev => new Set(prev).add(platformId));
    
    try {
      const result: PlatformConnectionResult = await platformIntegration.connectPlatform(platformId);
      
      if (result.success) {
        // Update platform status
        setPlatforms(prev => 
          prev.map(platform => 
            platform.id === platformId 
              ? { 
                  ...platform, 
                  is_connected: true, 
                  connection_status: 'active' 
                }
              : platform
          )
        );
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error connecting platform:', error);
      toast.error(`فشل في ربط المنصة`);
    } finally {
      setConnectingPlatforms(prev => {
        const newSet = new Set(prev);
        newSet.delete(platformId);
        return newSet;
      });
    }
  };

  const handleDisconnectPlatform = async (platformId: string) => {
    try {
      const success = await platformIntegration.disconnectPlatform(platformId);
      
      if (success) {
        setPlatforms(prev => 
          prev.map(platform => 
            platform.id === platformId 
              ? { 
                  ...platform, 
                  is_connected: false, 
                  connection_status: 'inactive' 
                }
              : platform
          )
        );
        toast.success('تم قطع الاتصال بنجاح');
      } else {
        toast.error('فشل في قطع الاتصال');
      }
    } catch (error) {
      console.error('Error disconnecting platform:', error);
      toast.error('فشل في قطع الاتصال');
    }
  };

  const getPlatformTypeIcon = (type: string) => {
    switch (type) {
      case 'social_media': return '📱';
      case 'ecommerce': return '🛒';
      case 'analytics': return '📊';
      case 'advertising': return '📢';
      default: return '🔗';
    }
  };

  const getPlatformTypeName = (type: string) => {
    switch (type) {
      case 'social_media': return 'وسائل التواصل';
      case 'ecommerce': return 'التجارة الإلكترونية';
      case 'analytics': return 'التحليلات';
      case 'advertising': return 'الإعلانات';
      default: return 'أخرى';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'سهل';
      case 'medium': return 'متوسط';
      case 'hard': return 'صعب';
      default: return 'غير محدد';
    }
  };

  const connectedCount = platforms.filter(p => p.is_connected).length;
  const platformsByType = platforms.reduce((acc, platform) => {
    if (!acc[platform.type]) {
      acc[platform.type] = [];
    }
    acc[platform.type].push(platform);
    return acc;
  }, {} as Record<string, Platform[]>);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            🔗 تكامل المنصات
            {connectedCount > 0 && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                {connectedCount} متصل
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPlatforms}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="mr-2">جاري تحميل المنصات...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(platformsByType).map(([type, typePlatforms]) => (
              <div key={type}>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  {getPlatformTypeIcon(type)}
                  {getPlatformTypeName(type)}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {typePlatforms.map((platform) => (
                    <Card key={platform.id} className="relative">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={platform.logo}
                              alt={platform.name}
                              className="w-10 h-10 rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/api/placeholder/40/40';
                              }}
                            />
                            <div>
                              <h5 className="font-medium">{platform.name}</h5>
                              {platform.is_connected && (
                                <div className="flex items-center gap-1 text-sm text-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  متصل
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge className={getDifficultyColor(platform.setup_difficulty)}>
                            {getDifficultyText(platform.setup_difficulty)}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {platform.description}
                        </p>

                        <div className="mb-4">
                          <h6 className="text-xs font-medium text-gray-500 mb-2">المميزات المتاحة:</h6>
                          <div className="flex flex-wrap gap-1">
                            {platform.supported_features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {platform.is_connected ? (
                            <>
                              <div className="flex items-center gap-1 text-sm text-green-600 flex-1">
                                <Wifi className="w-4 h-4" />
                                نشط
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisconnectPlatform(platform.id)}
                              >
                                <Unplug className="w-4 h-4 ml-1" />
                                قطع الاتصال
                              </Button>
                            </>
                          ) : (
                            <Button
                              onClick={() => handleConnectPlatform(platform.id)}
                              disabled={connectingPlatforms.has(platform.id)}
                              size="sm"
                              className="w-full"
                            >
                              {connectingPlatforms.has(platform.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin ml-1" />
                                  جاري الربط...
                                </>
                              ) : (
                                <>
                                  <Wifi className="w-4 h-4 ml-1" />
                                  ربط {platform.name}
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {platforms.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <WifiOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد منصات متاحة</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
