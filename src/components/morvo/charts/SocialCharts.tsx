
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartRenderer } from '@/components/visualization/ChartRenderer';
import { useVisualizationData } from '@/hooks/useVisualizationData';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react';

export const SocialCharts = () => {
  const [socialData, setSocialData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getTemplatesByAgent } = useVisualizationData();

  useEffect(() => {
    loadSocialData();
    
    // Set up real-time subscription for social media data
    const channel = supabase
      .channel('social_charts_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'social_media_data'
      }, () => {
        loadSocialData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSocialData = async () => {
    try {
      const { data, error } = await supabase
        .from('social_media_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setSocialData(data);
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demonstration
  const mockSentimentData = {
    positive: 65,
    neutral: 25,
    negative: 10
  };

  const mockEngagementData = [
    { platform: 'فيسبوك', likes: 1200, comments: 340, shares: 180, reach: 15000 },
    { platform: 'تويتر', likes: 890, comments: 220, shares: 120, reach: 8500 },
    { platform: 'إنستغرام', likes: 1580, comments: 420, shares: 200, reach: 12000 },
    { platform: 'لينكدين', likes: 450, comments: 85, shares: 60, reach: 5500 }
  ];

  const mockFollowerGrowth = [
    { date: '2024-01', فيسبوك: 5200, تويتر: 3100, إنستغرام: 4500 },
    { date: '2024-02', فيسبوك: 5450, تويتر: 3200, إنستغرام: 4800 },
    { date: '2024-03', فيسبوك: 5680, تويتر: 3350, إنستغرام: 5100 },
    { date: '2024-04', فيسبوك: 5920, تويتر: 3420, إنستغرام: 5400 }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-96">
            <CardContent className="flex items-center justify-center h-full">
              <div className="animate-pulse bg-gray-200 w-full h-full rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sentiment" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            المشاعر
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            التفاعل
          </TabsTrigger>
          <TabsTrigger value="growth" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            النمو
          </TabsTrigger>
          <TabsTrigger value="platforms" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            المنصات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentiment" className="mt-6">
          <ChartRenderer
            config={{
              type: 'donut',
              title: 'تحليل المشاعر الشامل',
              theme: 'light',
              rtl: true
            }}
            data={socialData?.[0]?.data?.sentiment_analysis || mockSentimentData}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="engagement" className="mt-6">
          <ChartRenderer
            config={{
              type: 'stackedBar',
              title: 'مقاييس التفاعل عبر المنصات',
              theme: 'light',
              rtl: true
            }}
            data={socialData?.[0]?.data?.engagement_metrics || mockEngagementData}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <ChartRenderer
            config={{
              type: 'line',
              title: 'نمو المتابعين',
              theme: 'light',
              rtl: true
            }}
            data={socialData?.[0]?.data?.follower_growth || mockFollowerGrowth}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="platforms" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockEngagementData.map((platform) => (
              <Card key={platform.platform}>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-3">{platform.platform}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>الإعجابات:</span>
                      <span className="font-semibold">{platform.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>التعليقات:</span>
                      <span className="font-semibold">{platform.comments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>المشاركات:</span>
                      <span className="font-semibold">{platform.shares.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>الوصول:</span>
                      <span className="font-bold text-blue-600">{platform.reach.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
