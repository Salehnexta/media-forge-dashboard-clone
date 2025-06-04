
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, FunnelChart, Funnel, LabelList
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

// بيانات اختبارات A/B
const abTestData = [
  { variant: 'العنوان A', conversion: 3.2, clicks: 1520, cost: 4500, color: '#3b82f6' },
  { variant: 'العنوان B', conversion: 2.8, clicks: 1340, cost: 4200, color: '#ef4444' },
  { variant: 'العنوان C', conversion: 3.7, clicks: 1680, cost: 4800, color: '#10b981' }
];

// بيانات قمع التحويل
const funnelData = [
  { stage: 'الوعي', value: 100000, percentage: 100, fill: '#3b82f6' },
  { stage: 'الاهتمام', value: 45000, percentage: 45, fill: '#10b981' },
  { stage: 'الاعتبار', value: 18000, percentage: 18, fill: '#f59e0b' },
  { stage: 'القصد', value: 6800, percentage: 6.8, fill: '#ef4444' },
  { stage: 'الشراء', value: 2850, percentage: 2.85, fill: '#8b5cf6' }
];

// بيانات نماذج النسب
const attributionData = [
  { model: 'آخر نقرة', revenue: 285000, percentage: 28.5, color: '#3b82f6' },
  { model: 'أول نقرة', revenue: 312000, percentage: 31.2, color: '#10b981' },
  { model: 'خطي', revenue: 298500, percentage: 29.85, color: '#f59e0b' },
  { model: 'تناقص الوقت', revenue: 291200, percentage: 29.12, color: '#ef4444' },
  { model: 'موضع النقرة', revenue: 305800, percentage: 30.58, color: '#8b5cf6' }
];

// بيانات أداء القنوات
const channelPerformanceData = [
  { channel: 'Social Media', spend: 45000, revenue: 189000, roas: 4.2, conversions: 156 },
  { channel: 'Google Ads', spend: 32000, revenue: 145600, roas: 4.55, conversions: 112 },
  { channel: 'Email Marketing', spend: 8000, revenue: 42000, roas: 5.25, conversions: 87 },
  { channel: 'Display Ads', spend: 15000, revenue: 48000, roas: 3.2, conversions: 65 }
];

// بيانات تطور الحملة عبر الزمن
const campaignTimelineData = [
  { week: 'الأسبوع 1', spend: 8500, revenue: 28500, conversions: 23, roas: 3.35 },
  { week: 'الأسبوع 2', spend: 12000, revenue: 42000, conversions: 34, roas: 3.5 },
  { week: 'الأسبوع 3', spend: 15500, revenue: 65500, conversions: 52, roas: 4.23 },
  { week: 'الأسبوع 4', spend: 18000, revenue: 79200, conversions: 68, roas: 4.4 },
  { week: 'الأسبوع 5', spend: 16500, revenue: 72600, conversions: 59, roas: 4.4 },
  { week: 'الأسبوع 6', spend: 19000, revenue: 89300, conversions: 74, roas: 4.7 }
];

// بيانات توزيع الميزانية
const budgetAllocationData = [
  { campaign: 'إطلاق المنتج', allocated: 75000, spent: 45000, performance: 95, color: '#10b981' },
  { campaign: 'العرض الموسمي', allocated: 50000, spent: 32000, performance: 78, color: '#3b82f6' },
  { campaign: 'الوعي بالعلامة', allocated: 20000, spent: 21500, performance: 45, color: '#ef4444' },
  { campaign: 'التجديد', allocated: 30000, spent: 18500, performance: 82, color: '#f59e0b' }
];

export const EnhancedCampaignCharts = () => {
  const isMobile = useIsMobile();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('نسبة') || entry.name.includes('معدل') ? '%' : ''}
              {entry.name.includes('ريال') || entry.name.includes('revenue') ? ' ريال' : ''}
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
        <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
          تحليلات الحملات المتقدمة
        </h2>
        <p className="text-gray-600 text-sm lg:text-base">تحليل شامل لأداء الحملات متعددة القنوات واختبارات A/B</p>
      </div>
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 lg:grid-cols-2 gap-8'}`}>
        {/* نتائج اختبارات A/B */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              نتائج اختبارات A/B
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={abTestData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="variant" 
                  stroke="#64748b"
                  fontSize={isMobile ? 10 : 12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="conversion" fill="#8b5cf6" name="معدل التحويل %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* أداء القنوات المختلفة */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              مقارنة أداء القنوات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <BarChart data={channelPerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={isMobile ? 10 : 12} />
                <YAxis 
                  dataKey="channel" 
                  type="category" 
                  width={isMobile ? 80 : 100}
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="roas" fill="#3b82f6" name="العائد على الاستثمار" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* قمع التحويل */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              قمع التحويل التفصيلي
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
                        backgroundColor: item.fill,
                        width: `${item.percentage}%`,
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

        {/* نماذج النسب */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              نماذج نسب المشاركة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <PieChart>
                <Pie
                  data={attributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 80 : 100}
                  dataKey="percentage"
                  label={({ model, percentage }) => `${model}: ${percentage}%`}
                  labelLine={false}
                  fontSize={isMobile ? 10 : 12}
                >
                  {attributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* تطور الحملة عبر الزمن */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              تطور أداء الحملة عبر الزمن
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 350}>
              <LineChart data={campaignTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="week" 
                  stroke="#64748b"
                  fontSize={isMobile ? 10 : 12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="roas" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="العائد على الاستثمار"
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: isMobile ? 4 : 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="التحويلات"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: isMobile ? 4 : 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* توزيع الميزانية والأداء */}
        <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-800 text-right font-bold text-lg flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              توزيع الميزانية مقابل الأداء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <ScatterChart data={budgetAllocationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="spent" 
                  name="المصروف"
                  fontSize={isMobile ? 10 : 12}
                />
                <YAxis 
                  dataKey="performance" 
                  name="الأداء"
                  fontSize={isMobile ? 10 : 12}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={<CustomTooltip />}
                />
                <Scatter 
                  dataKey="performance" 
                  fill="#10b981"
                  r={isMobile ? 6 : 8}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
