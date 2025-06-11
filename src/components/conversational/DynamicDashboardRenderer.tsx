
import React from 'react';
import { DashboardConfig, DashboardComponent } from '@/types/conversational';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DynamicDashboardRendererProps {
  dashboard: DashboardConfig;
  onActionClick: (command: string) => void;
  className?: string;
}

const MetricsCards: React.FC<{ data: any[]; config: any }> = ({ data, config }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {data.map((metric, index) => (
      <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              {metric.change && (
                <div className="flex items-center mt-2">
                  {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500 ml-1" />}
                  {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500 ml-1" />}
                  {metric.trend === 'neutral' && <Minus className="w-4 h-4 text-gray-500 ml-1" />}
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const DynamicChart: React.FC<{ component: DashboardComponent }> = ({ component }) => {
  const { type, data, config, title } = component;

  const renderChart = () => {
    switch (type) {
      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={config.colors?.[0] || '#3b82f6'} 
                strokeWidth={3}
                name="القيمة الحالية"
                dot={{ fill: config.colors?.[0] || '#3b82f6', strokeWidth: 2, r: 6 }}
              />
              {data.data[0]?.previous && (
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke={config.colors?.[1] || '#94a3b8'} 
                  strokeWidth={2}
                  strokeDasharray="8 8"
                  name="القيمة السابقة"
                  dot={{ fill: config.colors?.[1] || '#94a3b8', strokeWidth: 2, r: 4 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'area_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={config.colors?.[0] || '#10b981'} 
                fill={config.colors?.[0] || '#10b981'}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="sales" 
                fill={config.colors?.[0] || '#3b82f6'} 
                name="المبيعات الفعلية"
                radius={[4, 4, 0, 0]}
              />
              {data.data[0]?.target && (
                <Bar 
                  dataKey="target" 
                  fill={config.colors?.[1] || '#ef4444'} 
                  name="الهدف"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${value}% ${name}`}
                labelLine={false}
              >
                {data.data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, '']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">نوع الرسم البياني غير مدعوم</div>;
    }
  };

  if (type === 'metrics_cards') {
    return <MetricsCards data={data} config={config} />;
  }

  return (
    <Card className="border border-gray-200 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-800 text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export const DynamicDashboardRenderer: React.FC<DynamicDashboardRendererProps> = ({
  dashboard,
  onActionClick,
  className = ''
}) => {
  const getGridLayout = () => {
    switch (dashboard.layout) {
      case 'single':
        return 'grid-cols-1';
      case 'grid-2x2':
        return 'grid-cols-1 lg:grid-cols-2';
      case 'grid-3x1':
        return 'grid-cols-1 lg:grid-cols-3';
      case 'grid-2x3':
        return 'grid-cols-1 lg:grid-cols-3';
      default:
        return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
    }
  };

  return (
    <div className={`space-y-6 ${className}`} dir="rtl">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-800">{dashboard.title}</h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            تم إنشاؤها الآن
          </Badge>
        </div>
        
        {/* Insights */}
        {dashboard.insights.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-blue-700 mb-3">رؤى ذكية:</h3>
            <ul className="space-y-2">
              {dashboard.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 text-blue-600">
                  <span className="text-blue-400 mt-1">•</span>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dashboard Components */}
      <div className={`grid gap-6 ${getGridLayout()}`}>
        {dashboard.components.map((component) => (
          <DynamicChart
            key={component.id}
            component={component}
          />
        ))}
      </div>

      {/* Action Buttons */}
      {dashboard.actions.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center pt-4 border-t border-gray-200">
          {dashboard.actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => onActionClick(action.command)}
              variant={action.type === 'primary' ? 'default' : 'outline'}
              className="gap-2"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
