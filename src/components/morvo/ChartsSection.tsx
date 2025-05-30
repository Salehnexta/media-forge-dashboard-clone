
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AIManager } from "@/types/morvo";
import { mockChartData } from "@/data/morvoData";

interface ChartsSectionProps {
  selectedManager: AIManager;
}

export const ChartsSection = ({ selectedManager }: ChartsSectionProps) => {
  const renderStrategicCharts = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          المؤشرات الاستراتيجية - الاستراتيجي
        </h2>
        <p className="text-gray-600 mb-8">
          مؤشرات الأداء الاستراتيجي وتوزيع الميزانيات
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right">نمو حصة السوق والإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockChartData.strategic.roi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  name="الحصة الفعلية"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expected" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="8 8" 
                  name="الحصة المتوقعة"
                  dot={{ fill: '#94a3b8', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right">توزيع الميزانية على القنوات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockChartData.strategic.budget}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${value}%${name}`}
                  labelLine={false}
                >
                  {mockChartData.strategic.budget.map((entry, index) => (
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
            
            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {mockChartData.strategic.budget.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const chartRenderers = {
    strategic: renderStrategicCharts,
    monitor: renderStrategicCharts, // For now, show strategic for all
    executor: renderStrategicCharts,
    creative: renderStrategicCharts,
    analyst: renderStrategicCharts
  };

  return chartRenderers[selectedManager]();
};
