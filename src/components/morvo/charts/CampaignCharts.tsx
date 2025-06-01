
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const ctrData = [
  { week: 'الأسبوع 1', ctr: 2.1, benchmark: 1.8 },
  { week: 'الأسبوع 2', ctr: 2.5, benchmark: 1.9 },
  { week: 'الأسبوع 3', ctr: 3.2, benchmark: 2.0 },
  { week: 'الأسبوع 4', ctr: 2.8, benchmark: 2.1 },
  { week: 'الأسبوع 5', ctr: 3.5, benchmark: 2.2 },
  { week: 'الأسبوع 6', ctr: 4.1, benchmark: 2.3 }
];

const funnelData = [
  { stage: 'الانطباعات', value: 100000, percentage: 100, color: '#3b82f6' },
  { stage: 'النقرات', value: 15000, percentage: 15, color: '#10b981' },
  { stage: 'الزيارات', value: 8500, percentage: 8.5, color: '#f59e0b' },
  { stage: 'العملاء المحتملون', value: 2100, percentage: 2.1, color: '#ef4444' },
  { stage: 'المشتريات', value: 450, percentage: 0.45, color: '#8b5cf6' }
];

const cpaData = [
  { channel: 'جوجل إعلانات', cpa: 45, target: 50, performance: 'ممتاز' },
  { channel: 'فيسبوك إعلانات', cpa: 38, target: 45, performance: 'ممتاز' },
  { channel: 'لينكد إن', cpa: 72, target: 60, performance: 'يحتاج تحسين' },
  { channel: 'تويتر إعلانات', cpa: 55, target: 50, performance: 'جيد' },
  { channel: 'يوتيوب إعلانات', cpa: 62, target: 55, performance: 'جيد' }
];

const campaignROIData = [
  { spend: 1000, return: 2500, campaign: 'حملة أ', roi: 150 },
  { spend: 1500, return: 4200, campaign: 'حملة ب', roi: 180 },
  { spend: 800, return: 1800, campaign: 'حملة ج', roi: 125 },
  { spend: 2000, return: 5500, campaign: 'حملة د', roi: 175 },
  { spend: 1200, return: 3100, campaign: 'حملة هـ', roi: 158 }
];

const abTestData = [
  { variant: 'النسخة أ', conversion: 65, clicks: 3250, color: '#3b82f6' },
  { variant: 'النسخة ب', conversion: 35, clicks: 1750, color: '#ef4444' }
];

export const CampaignCharts = () => {
  const isMobile = useIsMobile();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('معدل') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 lg:space-y-8 p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          مخططات الحملات والأداء
        </h2>
        <p className="text-gray-600 text-sm lg:text-base">تحليل أداء الحملات ومعدلات التحويل والعائد على الاستثمار</p>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
        {/* CTR Line Chart */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              معدل النقر عبر الزمن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <LineChart data={ctrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="week" 
                  stroke="#64748b"
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={isMobile ? 10 : 12}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ctr" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="معدل النقر الفعلي"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: isMobile ? 4 : 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="المعيار المرجعي"
                  dot={{ fill: '#94a3b8', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CPA Bar Chart */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              تكلفة الاكتساب حسب القناة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={cpaData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={isMobile ? 10 : 12} />
                <YAxis 
                  dataKey="channel" 
                  type="category" 
                  width={isMobile ? 100 : 120}
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cpa" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="#e2e8f0" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign ROI Scatter Plot */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              العلاقة بين الإنفاق والعائد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <ScatterChart data={campaignROIData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="spend" 
                  name="الإنفاق"
                  fontSize={isMobile ? 10 : 12}
                />
                <YAxis 
                  dataKey="return" 
                  name="العائد"
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<CustomTooltip />}
                />
                <Scatter 
                  dataKey="return" 
                  fill="#8b5cf6"
                  r={isMobile ? 6 : 8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* A/B Test Results Pie Chart */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              نتائج اختبارات A/B
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={abTestData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 80 : 100}
                  dataKey="conversion"
                  label={({ variant, conversion }) => `${variant}: ${conversion}%`}
                  labelLine={false}
                  fontSize={isMobile ? 10 : 12}
                >
                  {abTestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              قمع التحويل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 lg:space-y-4">
              {funnelData.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm lg:text-base font-medium text-gray-700">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6 lg:h-8 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-center text-white font-semibold text-xs lg:text-sm"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.value / funnelData[0].value) * 100}%`,
                        minWidth: '60px'
                      }}
                    >
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
