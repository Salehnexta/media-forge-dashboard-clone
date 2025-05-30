
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Treemap
} from "recharts";

const websiteTrafficData = [
  { date: '1 يوليو', visits: 12500 },
  { date: '2 يوليو', visits: 13200 },
  { date: '3 يوليو', visits: 11800 },
  { date: '4 يوليو', visits: 14500 },
  { date: '5 يوليو', visits: 15200 },
  { date: '6 يوليو', visits: 16800 },
  { date: '7 يوليو', visits: 18200 }
];

const conversionFunnelData = [
  { stage: 'زوار الموقع', visitors: 100000, percentage: 100 },
  { stage: 'عرض المنتج', visitors: 45000, percentage: 45 },
  { stage: 'إضافة للسلة', visitors: 12000, percentage: 12 },
  { stage: 'بدء الدفع', visitors: 8500, percentage: 8.5 },
  { stage: 'إتمام الشراء', visitors: 3200, percentage: 3.2 }
];

const trafficSourcesData = [
  { source: 'البحث المباشر', value: 35, size: 3500 },
  { source: 'جوجل', value: 28, size: 2800 },
  { source: 'فيسبوك', value: 15, size: 1500 },
  { source: 'تويتر', value: 12, size: 1200 },
  { source: 'مواقع أخرى', value: 10, size: 1000 }
];

const sessionDurationConversionData = [
  { duration: 30, conversion: 1.2, sessions: 450 },
  { duration: 60, conversion: 2.8, sessions: 320 },
  { duration: 120, conversion: 5.5, sessions: 280 },
  { duration: 180, conversion: 8.2, sessions: 220 },
  { duration: 300, conversion: 12.8, sessions: 150 },
  { duration: 600, conversion: 18.5, sessions: 80 }
];

const kpiData = [
  { metric: 'معدل الارتداد', score: 25 }, // Lower is better, inverted for display
  { metric: 'الصفحات/الجلسة', score: 78 },
  { metric: 'مدة الجلسة', score: 85 },
  { metric: 'معدل التحويل', score: 72 },
  { metric: 'العائدون', score: 68 },
  { metric: 'رضا المستخدم', score: 88 }
];

const userTypesData = [
  { type: 'مستخدمون جدد', current: 6500, returning: 3200 },
  { type: 'مستخدمون عائدون', current: 4200, returning: 5800 }
];

export const AnalyticsCharts = () => {
  return (
    <div className="space-y-8 font-cairo">
      <div>
        <h2 className="text-3xl font-bold text-orange-600 mb-2">مخططات التحليلات الذكية</h2>
        <p className="text-gray-600 mb-8">تحليل سلوك المستخدمين ومؤشرات الأداء الرئيسية</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Website Traffic Line Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">زيارات الموقع اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={websiteTrafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="visits" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="الزيارات" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Types Comparison */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">مقارنة المستخدمين</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userTypesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="current" fill="#f59e0b" name="الحالي" />
                <Bar dataKey="returning" fill="#ef4444" name="العائد" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">قمع التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={conversionFunnelData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={120} />
                <Tooltip formatter={(value, name) => [
                  name === 'visitors' ? value.toLocaleString() : `${value}%`,
                  name === 'visitors' ? 'الزوار' : 'النسبة'
                ]} />
                <Bar dataKey="visitors" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Duration vs Conversion Scatter Plot */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">مدة الجلسة مقابل التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={sessionDurationConversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="duration" name="مدة الجلسة (ثانية)" />
                <YAxis dataKey="conversion" name="معدل التحويل %" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="conversion" fill="#f59e0b" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* KPI Radar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">مؤشرات الأداء الرئيسية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={kpiData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={0} domain={[0, 100]} />
                <Radar
                  name="النقاط"
                  dataKey="score"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources Treemap */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">مصادر الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <div className="grid grid-cols-2 gap-4 h-full">
                {trafficSourcesData.map((source, index) => (
                  <div 
                    key={index}
                    className="bg-orange-100 border border-orange-200 rounded-lg p-4 flex flex-col justify-center items-center text-center"
                    style={{ height: `${source.value * 2}px`, minHeight: '60px' }}
                  >
                    <div className="text-sm font-semibold text-orange-800">{source.source}</div>
                    <div className="text-lg font-bold text-orange-600">{source.value}%</div>
                  </div>
                ))}
              </div>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
