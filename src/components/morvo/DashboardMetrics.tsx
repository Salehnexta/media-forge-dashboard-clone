
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Target, BarChart3, Users } from 'lucide-react';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

interface DashboardMetricsProps {
  agentType: string;
}

export const DashboardMetrics = ({ agentType }: DashboardMetricsProps) => {
  const { metrics, isLoading, error } = useDashboardMetrics(agentType);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-red-100">
          <CardContent className="p-6">
            <p className="text-red-600 text-center font-medium">خطأ في تحميل المقاييس: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const metricCards = [
    {
      title: 'الأهداف النشطة',
      value: metrics.active_goals,
      change: '+12%',
      icon: Target,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'متوسط التقدم',
      value: `${metrics.average_progress}%`,
      change: '+5%',
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'عائد الاستثمار',
      value: `${metrics.roi_percentage}%`,
      change: '+8%',
      icon: BarChart3,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'الحملات النشطة',
      value: metrics.active_campaigns,
      change: '+3',
      icon: Users,
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metricCards.map((card, index) => (
        <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white border-gray-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-green-600 bg-green-100 border-green-200">
                    {card.change}
                  </Badge>
                </div>
              </div>
              <div className={`bg-gradient-to-r ${card.gradient} p-4 rounded-xl shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
