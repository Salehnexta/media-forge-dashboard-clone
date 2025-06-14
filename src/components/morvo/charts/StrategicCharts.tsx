
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ChartRenderer } from '@/components/visualization/ChartRenderer';
import { useVisualizationData } from '@/hooks/useVisualizationData';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, Target, BarChart3 } from 'lucide-react';

export const StrategicCharts = () => {
  const [strategicData, setStrategicData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getTemplatesByAgent } = useVisualizationData();

  useEffect(() => {
    loadStrategicData();
    
    // Set up real-time subscription for analytics data
    const channel = supabase
      .channel('strategic_charts_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'analytics_data'
      }, () => {
        loadStrategicData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadStrategicData = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .eq('metric_type', 'strategic')
        .order('timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setStrategicData(data);
    } catch (error) {
      console.error('Error loading strategic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const templates = getTemplatesByAgent('M1_STRATEGIC');

  // Mock data for demonstration
  const mockSwotData = {
    strengths: ['تقنية متقدمة', 'فريق خبير', 'موقع استراتيجي'],
    weaknesses: ['محدودية الموارد', 'ضعف في التسويق'],
    opportunities: ['نمو السوق', 'شراكات جديدة', 'تقنيات ناشئة'],
    threats: ['منافسة قوية', 'تغيرات تنظيمية']
  };

  const mockCompetitorData = [
    { name: 'المنافس أ', metrics: { الجودة: 85, السعر: 70, الخدمة: 90, الابتكار: 75, الوصول: 80 } },
    { name: 'المنافس ب', metrics: { الجودة: 75, السعر: 85, الخدمة: 70, الابتكار: 80, الوصول: 75 } },
    { name: 'شركتنا', metrics: { الجودة: 90, السعر: 60, الخدمة: 85, الابتكار: 85, الوصول: 70 } }
  ];

  const mockTrendData = [
    { date: '2024-01', value: 1200, forecast: null },
    { date: '2024-02', value: 1350, forecast: null },
    { date: '2024-03', value: 1280, forecast: null },
    { date: '2024-04', value: 1450, forecast: null },
    { date: '2024-05', value: null, forecast: 1520 },
    { date: '2024-06', value: null, forecast: 1600 }
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
      <Tabs defaultValue="swot" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="swot" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            تحليل SWOT
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            المنافسون
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            الاتجاهات
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            مؤشرات الأداء
          </TabsTrigger>
        </TabsList>

        <TabsContent value="swot" className="mt-6">
          <ChartRenderer
            config={{
              type: 'quadrant',
              title: 'تحليل SWOT الشامل',
              theme: 'light',
              rtl: true
            }}
            data={strategicData?.data?.swot_analysis || mockSwotData}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <ChartRenderer
            config={{
              type: 'radar',
              title: 'مقارنة تنافسية شاملة',
              options: {
                axes: ['الجودة', 'السعر', 'الخدمة', 'الابتكار', 'الوصول']
              },
              theme: 'light',
              rtl: true
            }}
            data={strategicData?.data?.competitor_data || mockCompetitorData}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <ChartRenderer
            config={{
              type: 'line',
              title: 'اتجاهات السوق والتوقعات',
              options: {
                forecast: true
              },
              theme: 'light',
              rtl: true
            }}
            data={strategicData?.data?.market_trends || mockTrendData}
            className="w-full"
          />
        </TabsContent>

        <TabsContent value="kpis" className="mt-6">
          <ChartRenderer
            config={{
              type: 'bullet',
              title: 'مؤشرات الأداء الرئيسية',
              theme: 'light',
              rtl: true
            }}
            data={strategicData?.data?.kpi_metrics || [
              { name: 'الإيرادات', current: 85, target: 100, previousPeriod: 78 },
              { name: 'نمو العملاء', current: 92, target: 100, previousPeriod: 85 },
              { name: 'الحصة السوقية', current: 78, target: 100, previousPeriod: 72 }
            ]}
            className="w-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
