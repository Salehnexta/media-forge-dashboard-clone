
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const engagementData = [
  { day: 'الاثنين', engagement: 12.5 },
  { day: 'الثلاثاء', engagement: 15.2 },
  { day: 'الأربعاء', engagement: 18.7 },
  { day: 'الخميس', engagement: 22.1 },
  { day: 'الجمعة', engagement: 28.5 },
  { day: 'السبت', engagement: 25.3 },
  { day: 'الأحد', engagement: 20.8 }
];

const sentimentData = [
  { name: 'إيجابي', value: 65, color: '#10b981' },
  { name: 'محايد', value: 25, color: '#f59e0b' },
  { name: 'سلبي', value: 10, color: '#ef4444' }
];

const hashtagData = [
  { hashtag: '#تسويق_رقمي', count: 1250 },
  { hashtag: '#تجارة_إلكترونية', count: 980 },
  { hashtag: '#وسائل_التواصل', count: 750 },
  { hashtag: '#ريادة_أعمال', count: 650 },
  { hashtag: '#ابتكار', count: 580 }
];

const platformData = [
  { platform: 'فيسبوك', engagement: 85 },
  { platform: 'تويتر', engagement: 65 },
  { platform: 'إنستغرام', engagement: 92 },
  { platform: 'لينكد إن', engagement: 48 }
];

const customerExperienceData = [
  { metric: 'سهولة الاستخدام', score: 85 },
  { metric: 'سرعة الاستجابة', score: 78 },
  { metric: 'جودة المحتوى', score: 92 },
  { metric: 'حل المشاكل', score: 75 },
  { metric: 'التفاعل', score: 88 },
  { metric: 'الثقة', score: 90 }
];

const demographicsData = [
  { age: '18-24', value: 25, color: '#3b82f6' },
  { age: '25-34', value: 35, color: '#10b981' },
  { age: '35-44', value: 25, color: '#f59e0b' },
  { age: '45+', value: 15, color: '#8b5cf6' }
];

export const SocialCharts = () => {
  return (
    <div className="space-y-8 font-cairo">
      <div>
        <h2 className="text-3xl font-bold text-pink-600 mb-2">مخططات السوشيال ميديا</h2>
        <p className="text-gray-600 mb-8">تحليل التفاعل وتجربة العملاء عبر منصات التواصل</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Engagement Line Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">معدل التفاعل اليومي</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  name="معدل التفاعل %" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sentiment Analysis Pie Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">تحليل المشاعر</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Hashtags Bar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">أكثر الهاشتاغات استخداماً</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hashtagData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="hashtag" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Platform Comparison Bar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">مقارنة التفاعل حسب المنصة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Experience Radar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">مؤشرات تجربة العميل</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={customerExperienceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={0} domain={[0, 100]} />
                <Radar
                  name="النقاط"
                  dataKey="score"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Demographics Pie Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">التوزيع الديموغرافي</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographicsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ age, value }) => `${age}: ${value}%`}
                >
                  {demographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'النسبة']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
