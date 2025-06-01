
import { useState } from 'react';
import { AIManager } from "@/types/morvo";
import { StrategicCharts } from './charts/StrategicCharts';
import { SocialCharts } from './charts/SocialCharts';
import { CampaignCharts } from './charts/CampaignCharts';
import { ContentCharts } from './charts/ContentCharts';
import { AnalyticsCharts } from './charts/AnalyticsCharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, BarChart3, Rocket, Palette, TrendingUp } from 'lucide-react';

interface DashboardSectionProps {
  selectedManager: AIManager;
}

const agentInfo = {
  strategic: { 
    name: 'المدير الاستراتيجي', 
    icon: Target, 
    color: 'text-blue-600',
    description: 'التخطيط الاستراتيجي وتحليل السوق'
  },
  monitor: { 
    name: 'مراقب الأداء', 
    icon: BarChart3, 
    color: 'text-green-600',
    description: 'مراقبة الأداء والمؤشرات'
  },
  executor: { 
    name: 'منفذ الحملات', 
    icon: Rocket, 
    color: 'text-purple-600',
    description: 'تنفيذ وإدارة الحملات'
  },
  creative: { 
    name: 'المبدع', 
    icon: Palette, 
    color: 'text-orange-600',
    description: 'إنتاج المحتوى الإبداعي'
  },
  analyst: { 
    name: 'المحلل', 
    icon: TrendingUp, 
    color: 'text-red-600',
    description: 'تحليل البيانات والتقارير'
  }
};

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  const [activeTab, setActiveTab] = useState<AIManager>(selectedManager);

  const renderCharts = (manager: AIManager) => {
    switch (manager) {
      case 'strategic':
        return <StrategicCharts />;
      case 'monitor':
        return <SocialCharts />;
      case 'executor':
        return <CampaignCharts />;
      case 'creative':
        return <ContentCharts />;
      case 'analyst':
        return <AnalyticsCharts />;
      default:
        return <StrategicCharts />;
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">منصة Morvo للتسويق الذكي</h1>
          <p className="text-gray-600">وكلاء ذكيون متخصصون لإدارة حملاتك التسويقية</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AIManager)} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-2">
            {Object.entries(agentInfo).map(([key, info]) => {
              const IconComponent = info.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex flex-col items-center gap-2 p-4 h-auto data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  <IconComponent className={`w-6 h-6 ${info.color}`} />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{info.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{info.description}</div>
                  </div>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(agentInfo).map((key) => (
            <TabsContent key={key} value={key} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {React.createElement(agentInfo[key as AIManager].icon, {
                      className: `w-6 h-6 ${agentInfo[key as AIManager].color}`
                    })}
                    لوحة تحكم {agentInfo[key as AIManager].name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCharts(key as AIManager)}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};
