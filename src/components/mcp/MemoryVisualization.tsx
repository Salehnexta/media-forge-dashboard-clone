
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useMCPMemory } from '@/hooks/useMCPMemory';
import { useCrossAgentContext } from '@/hooks/useCrossAgentContext';
import { Brain, Share2, Clock, Star, Trash2, Eye } from 'lucide-react';
import { AgentMemory } from '@/contexts/MCPContext';

interface MemoryVisualizationProps {
  agentType: string;
}

export const MemoryVisualization = ({ agentType }: MemoryVisualizationProps) => {
  const { memories, isLoading, clearAgentMemory, updateRelevanceScore } = useMCPMemory({ agentType });
  const { getSharedInsights, collaborationHistory } = useCrossAgentContext();
  const [selectedMemory, setSelectedMemory] = useState<AgentMemory | null>(null);

  const sharedInsights = getSharedInsights(agentType);
  
  const getMemoryTypeColor = (type: string) => {
    const colors = {
      analysis: 'bg-blue-500',
      insight: 'bg-green-500',
      context: 'bg-purple-500',
      preference: 'bg-orange-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRelevanceUpdate = async (memoryId: string, newScore: number) => {
    await updateRelevanceScore(memoryId, newScore);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="mr-2">جاري تحميل الذاكرة...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            ذاكرة الوكيل - {agentType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="memories" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="memories">الذكريات ({memories.length})</TabsTrigger>
              <TabsTrigger value="shared">المشاركة ({sharedInsights.length})</TabsTrigger>
              <TabsTrigger value="collaboration">التعاون ({collaborationHistory.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="memories" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  إجمالي الذكريات المحفوظة: {memories.length}
                </p>
                <Button
                  onClick={clearAgentMemory}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  مسح الذاكرة
                </Button>
              </div>

              <div className="grid gap-3">
                {memories.map((memory) => (
                  <Card key={memory.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getMemoryTypeColor(memory.memory_type)} text-white`}>
                          {memory.memory_type}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          <Clock className="w-3 h-3 inline ml-1" />
                          {formatDate(memory.created_at)}
                        </span>
                      </div>
                      <Button
                        onClick={() => setSelectedMemory(memory)}
                        variant="ghost"
                        size="sm"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">درجة الصلة:</span>
                        <Progress value={memory.relevance_score * 100} className="flex-1 max-w-32" />
                        <span className="text-sm">{Math.round(memory.relevance_score * 100)}%</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {JSON.stringify(memory.content).substring(0, 100)}...
                      </p>
                    </div>
                  </Card>
                ))}

                {memories.length === 0 && (
                  <Card className="p-8 text-center">
                    <Brain className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">لا توجد ذكريات محفوظة لهذا الوكيل</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shared" className="space-y-4">
              <p className="text-sm text-gray-600">
                الرؤى المشاركة مع هذا الوكيل: {sharedInsights.length}
              </p>

              <div className="grid gap-3">
                {sharedInsights.map((insight, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">من {insight.fromAgent}</span>
                      <Badge variant="outline">{insight.data.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      {insight.data.timestamp && formatDate(insight.data.timestamp)}
                    </p>
                  </Card>
                ))}

                {sharedInsights.length === 0 && (
                  <Card className="p-8 text-center">
                    <Share2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">لا توجد رؤى مشاركة</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="collaboration" className="space-y-4">
              <p className="text-sm text-gray-600">
                سجل التعاون: {collaborationHistory.length} تفاعل
              </p>

              <div className="grid gap-3">
                {collaborationHistory.slice(0, 10).map((collab, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{collab.from_agent}</span>
                        <span className="mx-2">←</span>
                        <span className="font-medium">{collab.to_agent}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(collab.timestamp)}
                      </span>
                    </div>
                  </Card>
                ))}

                {collaborationHistory.length === 0 && (
                  <Card className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto text-gray-400 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500">لا يوجد سجل تعاون</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Memory Detail Modal */}
      {selectedMemory && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>تفاصيل الذاكرة</CardTitle>
              <Button
                onClick={() => setSelectedMemory(null)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">النوع:</label>
                <Badge className={`${getMemoryTypeColor(selectedMemory.memory_type)} text-white mr-2`}>
                  {selectedMemory.memory_type}
                </Badge>
              </div>
              
              <div>
                <label className="text-sm font-medium">تاريخ الإنشاء:</label>
                <p className="text-sm">{formatDate(selectedMemory.created_at)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">المحتوى:</label>
                <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-64">
                  {JSON.stringify(selectedMemory.content, null, 2)}
                </pre>
              </div>
              
              <div>
                <label className="text-sm font-medium">درجة الصلة:</label>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={selectedMemory.relevance_score * 100} className="flex-1" />
                  <span className="text-sm">{Math.round(selectedMemory.relevance_score * 100)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
