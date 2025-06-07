
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, Clock, User } from 'lucide-react';
import { morvoApiService, AgentStatus } from '@/services/MorvoApiService';
import { AGENTS } from '@/config/morvoApi';
import { toast } from 'sonner';

export const AgentStatusDashboard = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAgentStatus = async () => {
    try {
      setIsLoading(true);
      const agentData = await morvoApiService.getAgentStatus();
      setAgents(agentData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
      toast.error('فشل في تحديث حالة الوكلاء');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getAgentInfo = (agentId: string) => {
    const agentKey = agentId.toUpperCase() as keyof typeof AGENTS;
    return AGENTS[agentKey] || {
      name: 'وكيل غير معروف',
      color: 'from-gray-500 to-gray-600',
      emoji: '🤖'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'متاح';
      case 'busy': return 'مشغول';
      case 'offline': return 'غير متصل';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">حالة الوكلاء الذكيين</h2>
          <p className="text-gray-600">مراقبة الوكلاء في الوقت الفعلي</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              آخر تحديث: {lastUpdated.toLocaleTimeString('ar-SA')}
            </div>
          )}
          <Button
            onClick={fetchAgentStatus}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {agents.map((agent) => {
          const agentInfo = getAgentInfo(agent.agent_id);
          
          return (
            <Card key={agent.agent_id} className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-full h-1 bg-gradient-to-r ${agentInfo.color}`} />
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{agentInfo.emoji}</div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
                    <Badge 
                      variant={agent.status === 'online' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {getStatusText(agent.status)}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-sm font-semibold leading-tight">
                  {agent.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {agent.specialization}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Activity className="w-3 h-3" />
                    <span>
                      آخر نشاط: {new Date(agent.last_seen).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    className={`w-full bg-gradient-to-r ${agentInfo.color} hover:opacity-90 text-white text-xs`}
                    disabled={agent.status !== 'online'}
                  >
                    <User className="w-3 h-3 ml-1" />
                    تحدث مع {agent.agent_id.toUpperCase()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading && agents.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل حالة الوكلاء...</p>
        </div>
      )}
    </div>
  );
};
