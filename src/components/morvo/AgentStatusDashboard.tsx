
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Eye, 
  Zap, 
  Palette, 
  BarChart3, 
  Activity, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: 'strategic' | 'monitor' | 'executor' | 'creative' | 'analyst';
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  tasksCompleted: number;
  efficiency: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  currentTask?: string;
}

const agents: Agent[] = [
  {
    id: 'M1',
    name: 'المدير الاستراتيجي',
    type: 'strategic',
    status: 'active',
    lastActivity: 'منذ 2 دقائق',
    tasksCompleted: 24,
    efficiency: 92,
    icon: Brain,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    currentTask: 'تحليل السوق المستهدف'
  },
  {
    id: 'M2',
    name: 'مراقب وسائل التواصل',
    type: 'monitor',
    status: 'processing',
    lastActivity: 'منذ 30 ثانية',
    tasksCompleted: 18,
    efficiency: 88,
    icon: Eye,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    currentTask: 'مراقبة تفاعل العملاء'
  },
  {
    id: 'M3',
    name: 'منفذ الحملات',
    type: 'executor',
    status: 'active',
    lastActivity: 'منذ 1 دقيقة',
    tasksCompleted: 31,
    efficiency: 95,
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    currentTask: 'تشغيل حملة العروض الصيفية'
  },
  {
    id: 'M4',
    name: 'المبدع الإبداعي',
    type: 'creative',
    status: 'active',
    lastActivity: 'منذ 5 دقائق',
    tasksCompleted: 15,
    efficiency: 87,
    icon: Palette,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    currentTask: 'تصميم محتوى إبداعي'
  },
  {
    id: 'M5',
    name: 'محلل البيانات',
    type: 'analyst',
    status: 'idle',
    lastActivity: 'منذ 10 دقائق',
    tasksCompleted: 22,
    efficiency: 90,
    icon: BarChart3,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  }
];

export const AgentStatusDashboard = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [systemHealth, setSystemHealth] = useState(96);

  // Simulate connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
      setSystemHealth(Math.floor(Math.random() * 10) + 90);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'idle':
        return <Activity className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'idle':
        return 'bg-gray-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'نشط';
      case 'processing':
        return 'يعمل';
      case 'idle':
        return 'خامل';
      case 'error':
        return 'خطأ';
      default:
        return 'غير معروف';
    }
  };

  const activeAgents = agents.filter(agent => agent.status === 'active' || agent.status === 'processing').length;
  const totalTasks = agents.reduce((sum, agent) => sum + agent.tasksCompleted, 0);
  const avgEfficiency = Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length);

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-900">حالة الوكلاء الذكيين</h3>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">صحة النظام</p>
            <p className="text-lg font-bold text-green-600">{systemHealth}%</p>
          </div>
          <Progress value={systemHealth} className="w-24" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">الوكلاء النشطين</p>
                <p className="text-2xl font-bold text-blue-700">{activeAgents}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">المهام المكتملة</p>
                <p className="text-2xl font-bold text-green-700">{totalTasks}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">متوسط الكفاءة</p>
                <p className="text-2xl font-bold text-purple-700">{avgEfficiency}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            تم اكتشاف انقطاع في الاتصال. يعمل النظام في الوضع المحلي حالياً.
          </AlertDescription>
        </Alert>
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {agents.map((agent) => {
          const IconComponent = agent.icon;
          return (
            <Card 
              key={agent.id} 
              className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${agent.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${agent.color}`} />
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {getStatusText(agent.status)}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-gray-900">
                  {agent.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">آخر نشاط:</span>
                  <span className="font-medium text-gray-900">{agent.lastActivity}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">المهام:</span>
                  <span className="font-medium text-gray-900">{agent.tasksCompleted}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الكفاءة:</span>
                    <span className="font-medium text-gray-900">{agent.efficiency}%</span>
                  </div>
                  <Progress value={agent.efficiency} className="h-2" />
                </div>
                
                {agent.currentTask && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">المهمة الحالية:</p>
                    <p className="text-xs font-medium text-gray-700 leading-relaxed">
                      {agent.currentTask}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-center pt-2">
                  {getStatusIcon(agent.status)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
