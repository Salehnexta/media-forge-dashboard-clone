
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, 
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const marketShareData = [
  { name: 'منتجاتنا', value: 35, color: '#3b82f6' },
  { name: 'المنافس أ', value: 25, color: '#ef4444' },
  { name: 'المنافس ب', value: 20, color: '#f59e0b' },
  { name: 'آخرون', value: 20, color: '#94a3b8' }
];

const marketGrowthData = [
  { month: 'يناير', growth: 12 },
  { month: 'فبراير', growth: 15 },
  { month: 'مارس', growth: 18 },
  { month: 'أبريل', growth: 22 },
  { month: 'مايو', growth: 28 },
  { month: 'يونيو', growth: 32 }
];

const revenueData = [
  { sector: 'التجارة الإلكترونية', revenue: 450000 },
  { sector: 'الخدمات المالية', revenue: 380000 },
  { sector: 'التعليم', revenue: 320000 },
  { sector: 'الصحة', revenue: 280000 },
  { sector: 'السياحة', revenue: 250000 }
];

const productPositionData = [
  { rating: 4.2, marketSize: 85, name: 'منتج أ' },
  { rating: 3.8, marketSize: 65, name: 'منتج ب' },
  { rating: 4.5, marketSize: 45, name: 'منتج ج' },
  { rating: 3.2, marketSize: 35, name: 'منتج د' },
  { rating: 4.0, marketSize: 55, name: 'منتج هـ' }
];

const swotData = [
  { factor: 'نقاط القوة', value: 85 },
  { factor: 'نقاط الضعف', value: 45 },
  { factor: 'الفرص', value: 75 },
  { factor: 'التهديدات', value: 35 },
  { factor: 'الابتكار', value: 80 },
  { factor: 'الخبرة', value: 90 }
];

export const StrategicCharts = () => {
  return (
    <div className="space-y-8 font-cairo">
      <div>
        <h2 className="text-3xl font-bold text-blue-600 mb-2">مخططات الاستراتيجي</h2>
        <p className="text-gray-600 mb-8">تحليل شامل للوضع الاستراتيجي وحصة السوق</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Share Pie Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">حصة السوق</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Growth Line Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">نمو السوق عبر الزمن</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="growth" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="النمو %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Bar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">الإيرادات حسب القطاع</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="sector" type="category" width={120} />
                <Tooltip formatter={(value) => [value.toLocaleString(), 'الإيرادات']} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Position Scatter Plot */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">تموضع المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={productPositionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" name="التقييم" />
                <YAxis dataKey="marketSize" name="حجم السوق" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="marketSize" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* SWOT Radar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">تحليل SWOT</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={swotData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="factor" />
                <PolarRadiusAxis angle={0} domain={[0, 100]} />
                <Radar
                  name="التقييم"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
