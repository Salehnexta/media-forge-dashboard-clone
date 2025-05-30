
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList
} from "recharts";

const ctrData = [
  { week: 'الأسبوع 1', ctr: 2.1 },
  { week: 'الأسبوع 2', ctr: 2.5 },
  { week: 'الأسبوع 3', ctr: 3.2 },
  { week: 'الأسبوع 4', ctr: 2.8 },
  { week: 'الأسبوع 5', ctr: 3.5 },
  { week: 'الأسبوع 6', ctr: 4.1 }
];

const funnelData = [
  { stage: 'الانطباعات', value: 100000, fill: '#3b82f6' },
  { stage: 'النقرات', value: 15000, fill: '#10b981' },
  { stage: 'الزيارات', value: 8500, fill: '#f59e0b' },
  { stage: 'العملاء المحتملون', value: 2100, fill: '#ef4444' },
  { stage: 'المشتريات', value: 450, fill: '#8b5cf6' }
];

const cpaData = [
  { channel: 'جوجل إعلانات', cpa: 45 },
  { channel: 'فيسبوك إعلانات', cpa: 38 },
  { channel: 'لينكد إن', cpa: 72 },
  { channel: 'تويتر إعلانات', cpa: 55 },
  { channel: 'يوتيوب إعلانات', cpa: 62 }
];

const campaignROIData = [
  { spend: 1000, return: 2500, campaign: 'حملة أ' },
  { spend: 1500, return: 4200, campaign: 'حملة ب' },
  { spend: 800, return: 1800, campaign: 'حملة ج' },
  { spend: 2000, return: 5500, campaign: 'حملة د' },
  { spend: 1200, return: 3100, campaign: 'حملة هـ' }
];

const abTestData = [
  { variant: 'النسخة أ', conversion: 65, color: '#3b82f6' },
  { variant: 'النسخة ب', conversion: 35, color: '#ef4444' }
];

export const CampaignCharts = () => {
  return (
    <div className="space-y-8 font-cairo">
      <div>
        <h2 className="text-3xl font-bold text-green-600 mb-2">مخططات الحملات والأداء</h2>
        <p className="text-gray-600 mb-8">تحليل أداء الحملات ومعدلات التحويل والعائد على الاستثمار</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CTR Line Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">معدل النقر عبر الزمن</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ctrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value) => [`${value}%`, 'معدل النقر']} />
                <Line 
                  type="monotone" 
                  dataKey="ctr" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="معدل النقر %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* CPA Bar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">تكلفة الاكتساب حسب القناة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cpaData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="channel" type="category" width={120} />
                <Tooltip formatter={(value) => [`$${value}`, 'تكلفة الاكتساب']} />
                <Bar dataKey="cpa" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Campaign ROI Scatter Plot */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">العلاقة بين الإنفاق والعائد</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={campaignROIData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="spend" name="الإنفاق" />
                <YAxis dataKey="return" name="العائد" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="return" fill="#10b981" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* A/B Test Results Pie Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">نتائج اختبارات A/B</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={abTestData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="conversion"
                  label={({ variant, conversion }) => `${variant}: ${conversion}%`}
                >
                  {abTestData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'معدل التحويل']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-white border border-gray-200 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">قمع التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <div className="flex flex-col items-center space-y-4">
                {funnelData.map((item, index) => (
                  <div key={index} className="w-full max-w-md">
                    <div 
                      className="text-center p-4 rounded-lg text-white font-semibold"
                      style={{ 
                        backgroundColor: item.fill,
                        width: `${(item.value / funnelData[0].value) * 100}%`,
                        margin: '0 auto'
                      }}
                    >
                      {item.stage}: {item.value.toLocaleString()}
                    </div>
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
