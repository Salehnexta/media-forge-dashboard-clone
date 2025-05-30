
import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { 
  PresentationChart, 
  Video, 
  Mic, 
  Image, 
  FileText 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AIManager } from "@/types/morvo";

interface DashboardSectionProps {
  selectedManager: AIManager;
}

export const DashboardSection = ({ selectedManager }: DashboardSectionProps) => {
  const [stats] = useState([
    { id: 1, name: 'إجمالي المشاريع', stat: '142', icon: PresentationChart, change: '12%', changeType: 'increase' },
    { id: 2, name: 'مقاطع الفيديو المُولّدة', stat: '47', icon: Video, change: '8%', changeType: 'increase' },
    { id: 3, name: 'الملفات الصوتية المُولّدة', stat: '58', icon: Mic, change: '5%', changeType: 'increase' },
    { id: 4, name: 'الصور المُولّدة', stat: '215', icon: Image, change: '19%', changeType: 'increase' },
    { id: 5, name: 'المستندات المُولّدة', stat: '76', icon: FileText, change: '3%', changeType: 'decrease' },
  ]);

  const chartData = [
    { name: 'يناير', videos: 12, images: 35, audio: 20, documents: 15 },
    { name: 'فبراير', videos: 19, images: 42, audio: 25, documents: 22 },
    { name: 'مارس', videos: 25, images: 45, audio: 30, documents: 25 },
    { name: 'أبريل', videos: 32, images: 55, audio: 35, documents: 30 },
    { name: 'مايو', videos: 40, images: 75, audio: 40, documents: 35 },
    { name: 'يونيو', videos: 47, images: 85, audio: 45, documents: 40 },
  ];

  const recentProjects = [
    { id: 1, name: 'حملة تسويقية', type: 'فيديو', date: 'منذ يومين', status: 'مكتمل' },
    { id: 2, name: 'عرض تقديمي للمنتج', type: 'مستند', date: 'منذ 4 أيام', status: 'قيد التنفيذ' },
    { id: 3, name: 'أصول وسائل التواصل', type: 'صورة', date: 'منذ أسبوع', status: 'مكتمل' },
    { id: 4, name: 'حلقة بودكاست', type: 'صوت', date: 'منذ أسبوع', status: 'مكتمل' },
    { id: 5, name: 'دليل العلامة التجارية', type: 'مستند', date: 'منذ أسبوعين', status: 'مكتمل' },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">نظرة عامة على توليد الوسائط</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue="last30Days"
          >
            <option value="today">اليوم</option>
            <option value="yesterday">أمس</option>
            <option value="last7Days">آخر 7 أيام</option>
            <option value="last30Days">آخر 30 يوماً</option>
            <option value="thisMonth">هذا الشهر</option>
            <option value="lastMonth">الشهر الماضي</option>
          </select>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative bg-white pt-5 px-4 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-blue-100 rounded-md p-3">
                <item.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <p className="mr-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
            </dt>
            <dd className="mr-16 pb-6 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={`mr-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.changeType === 'increase' ? (
                  <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                ) : (
                  <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                )}
                <span className="mr-1">{item.change}</span>
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">اتجاهات توليد الوسائط</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="videos" fill="#3B82F6" name="مقاطع الفيديو" />
              <Bar dataKey="images" fill="#10B981" name="الصور" />
              <Bar dataKey="audio" fill="#F59E0B" name="الصوت" />
              <Bar dataKey="documents" fill="#8B5CF6" name="المستندات" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">المشاريع الأخيرة</h3>
        </div>
        <div className="bg-white overflow-hidden">
          <ul role="list" className="divide-y divide-gray-200">
            {recentProjects.map((project) => (
              <li key={project.id}>
                <div className="px-6 py-4 flex items-center">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      {project.type === 'فيديو' && <Video className="h-10 w-10 rounded-full p-2 bg-blue-100 text-blue-600" />}
                      {project.type === 'صوت' && <Mic className="h-10 w-10 rounded-full p-2 bg-yellow-100 text-yellow-600" />}
                      {project.type === 'صورة' && <Image className="h-10 w-10 rounded-full p-2 bg-green-100 text-green-600" />}
                      {project.type === 'مستند' && <FileText className="h-10 w-10 rounded-full p-2 bg-purple-100 text-purple-600" />}
                    </div>
                    <div className="min-w-0 flex-1 px-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600 truncate">{project.name}</p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          <span className="truncate">{project.type}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                    <span className="text-sm text-gray-500">{project.date}</span>
                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
