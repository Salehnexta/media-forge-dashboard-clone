
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentCard } from './AgentCard';
import { CrewRunner } from './CrewRunner';
import { AGENT_TYPES } from '@/api/railway/agentEndpoints';
import { CompanyData } from '@/hooks/useRailwayAgent';

interface AgentRunnerProps {
  companyData: CompanyData | null;
}

export const AgentRunner = ({ companyData }: AgentRunnerProps) => {
  const [results, setResults] = useState<Record<string, any>>({});

  const handleAgentResult = (agentType: string, result: any) => {
    setResults(prev => ({
      ...prev,
      [agentType]: result
    }));
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            منصة الوكلاء الذكيين للتسويق
          </CardTitle>
          <p className="text-gray-600 text-center">
            اختر الوكيل المناسب لتحليل شركتك أو استخدم فريق العمل الكامل
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">الوكلاء الفرديين</TabsTrigger>
              <TabsTrigger value="crews">فرق العمل</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(AGENT_TYPES).map((agentType) => (
                  <AgentCard
                    key={agentType}
                    agentType={agentType}
                    companyData={companyData}
                    onResultReady={(result) => handleAgentResult(agentType, result)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="crews" className="space-y-4">
              <CrewRunner 
                companyData={companyData}
                onResultReady={(crewType, result) => handleAgentResult(crewType, result)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نتائج التحليل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(results).map(([agentType, result]) => (
                <div key={agentType} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{agentType}</h4>
                  <pre className="text-sm bg-white p-3 rounded border overflow-auto max-h-40">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
