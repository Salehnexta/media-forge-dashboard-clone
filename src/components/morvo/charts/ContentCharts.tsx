import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
const contentPerformanceData = [{
  month: 'يناير',
  views: 15000,
  engagement: 12.5
}, {
  month: 'فبراير',
  views: 18500,
  engagement: 14.2
}, {
  month: 'مارس',
  views: 22000,
  engagement: 16.8
}, {
  month: 'أبريل',
  views: 25500,
  engagement: 18.5
}, {
  month: 'مايو',
  views: 28000,
  engagement: 20.1
}, {
  month: 'يونيو',
  views: 32000,
  engagement: 22.7
}];
const topArticlesData = [{
  title: 'دليل التسويق الرقمي',
  reads: 5200
}, {
  title: 'استراتيجيات السوشيال ميديا',
  reads: 4800
}, {
  title: 'تحسين محركات البحث',
  reads: 4200
}, {
  title: 'التسويق بالمحتوى',
  reads: 3900
}, {
  title: 'إعلانات جوجل',
  reads: 3500
}];
const contentTypesData = [{
  type: 'مقالات',
  value: 40,
  color: '#3b82f6'
}, {
  type: 'فيديوهات',
  value: 25,
  color: '#ef4444'
}, {
  type: 'إنفوجرافيك',
  value: 20,
  color: '#10b981'
}, {
  type: 'بودكاست',
  value: 15,
  color: '#f59e0b'
}];
const contentLengthEngagementData = [{
  length: 500,
  engagement: 8.2,
  title: 'مقال قصير'
}, {
  length: 1200,
  engagement: 15.5,
  title: 'مقال متوسط'
}, {
  length: 2000,
  engagement: 22.8,
  title: 'مقال طويل'
}, {
  length: 800,
  engagement: 12.1,
  title: 'مقال قصير'
}, {
  length: 1500,
  engagement: 18.9,
  title: 'مقال متوسط'
}, {
  length: 2500,
  engagement: 25.3,
  title: 'مقال مفصل'
}];
const contentQualityData = [{
  metric: 'الأصالة',
  score: 85
}, {
  metric: 'العمق',
  score: 78
}, {
  metric: 'الجاذبية',
  score: 92
}, {
  metric: 'الوضوح',
  score: 88
}, {
  metric: 'القيمة المضافة',
  score: 90
}, {
  metric: 'سهولة القراءة',
  score: 82
}];
export const ContentCharts = () => {
  return <div className="space-y-8 font-cairo py-[11px] my-0 mx-0 px-0">
      <div>
        <h2 className="text-3xl font-bold text-purple-600 mb-2">مخططات المحتوى الذكي</h2>
        <p className="text-gray-600 mb-8">تحليل أداء المحتوى وقياس التفاعل والجودة</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Performance Line Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">أداء المحتوى عبر الزمن</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={contentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={3} name="المشاهدات" />
                <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#ec4899" strokeWidth={3} name="التفاعل %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Articles Bar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">أكثر المقالات قراءة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topArticlesData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="reads" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Types Pie Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">توزيع أنواع المحتوى</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={contentTypesData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({
                type,
                value
              }) => `${type}: ${value}%`}>
                  {contentTypesData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={value => [`${value}%`, 'النسبة']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Length vs Engagement Scatter Plot */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">العلاقة بين طول المحتوى والتفاعل</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={contentLengthEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="length" name="طول المحتوى" />
                <YAxis dataKey="engagement" name="التفاعل" />
                <Tooltip cursor={{
                strokeDasharray: '3 3'
              }} />
                <Scatter dataKey="engagement" fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Quality Radar Chart */}
        <Card className="bg-white border border-gray-200 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-gray-800 text-right font-cairo">تقييم جودة المحتوى</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={contentQualityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={0} domain={[0, 100]} />
                <Radar name="النقاط" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>;
};