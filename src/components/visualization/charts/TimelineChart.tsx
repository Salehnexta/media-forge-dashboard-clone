
import React from 'react';
import { ChartConfig } from '@/types/visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface TimelineChartProps {
  data: any[];
  config: ChartConfig;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data, config }) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
          <Calendar className="w-5 h-5" />
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>
          
          <div className="space-y-6">
            {sortedData.map((item, index) => (
              <div key={index} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'in-progress' ? 'bg-blue-500' :
                    item.status === 'scheduled' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.date).toLocaleDateString('ar-SA')}
                        </div>
                        {item.time && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </div>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'scheduled' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'completed' ? 'مكتمل' :
                           item.status === 'in-progress' ? 'قيد التنفيذ' :
                           item.status === 'scheduled' ? 'مجدول' : 'معلق'}
                        </span>
                      </div>
                    </div>
                    
                    {item.platform && (
                      <div className="flex-shrink-0 text-right">
                        <span className="text-xs text-gray-500">المنصة:</span>
                        <p className="text-sm font-medium">{item.platform}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600">مكتمل</p>
            <p className="text-lg font-bold text-green-600">
              {sortedData.filter(item => item.status === 'completed').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">قيد التنفيذ</p>
            <p className="text-lg font-bold text-blue-600">
              {sortedData.filter(item => item.status === 'in-progress').length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">مجدول</p>
            <p className="text-lg font-bold text-yellow-600">
              {sortedData.filter(item => item.status === 'scheduled').length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
