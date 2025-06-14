
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { externalAgentService, ExternalAgentConfig } from '@/services/ExternalAgentService';
import { toast } from 'sonner';

export const ExternalAgentConfig: React.FC = () => {
  const [agents, setAgents] = useState<ExternalAgentConfig[]>([]);
  const [testingAgent, setTestingAgent] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    setAgents(externalAgentService.getAllAgents());
  };

  const handleUpdateAgent = async (agentId: string, field: keyof ExternalAgentConfig, value: string) => {
    try {
      await externalAgentService.updateAgentConfig(agentId, { [field]: value });
      loadAgents();
      toast.success(`Agent ${agentId} updated successfully`);
    } catch (error) {
      toast.error('Failed to update agent configuration');
    }
  };

  const testAgentConnection = async (agent: ExternalAgentConfig) => {
    if (!agent.baseUrl) {
      toast.error('Please set the base URL first');
      return;
    }

    setTestingAgent(agent.id);
    
    try {
      const response = await fetch(`${agent.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': agent.apiKey ? `Bearer ${agent.apiKey}` : '',
        }
      });

      const isConnected = response.ok;
      setConnectionStatus(prev => ({ ...prev, [agent.id]: isConnected }));
      
      if (isConnected) {
        toast.success(`${agent.name} is connected successfully`);
      } else {
        toast.error(`Failed to connect to ${agent.name}`);
      }
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [agent.id]: false }));
      toast.error(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setTestingAgent(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5" />
        <h2 className="text-xl font-bold">External AI Agents Configuration</h2>
      </div>

      <div className="grid gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={agent.type === 'conversation' ? 'default' : 'secondary'}>
                    {agent.type}
                  </Badge>
                  {connectionStatus[agent.id] !== undefined && (
                    connectionStatus[agent.id] ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`${agent.id}-url`}>Base URL</Label>
                  <Input
                    id={`${agent.id}-url`}
                    value={agent.baseUrl}
                    onChange={(e) => handleUpdateAgent(agent.id, 'baseUrl', e.target.value)}
                    placeholder="https://your-agent-api.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${agent.id}-key`}>API Key (Optional)</Label>
                  <Input
                    id={`${agent.id}-key`}
                    type="password"
                    value={agent.apiKey || ''}
                    onChange={(e) => handleUpdateAgent(agent.id, 'apiKey', e.target.value)}
                    placeholder="Your API key"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={() => testAgentConnection(agent)}
                  disabled={testingAgent === agent.id || !agent.baseUrl}
                  variant="outline"
                  size="sm"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {testingAgent === agent.id ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Configuration Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <ol className="list-decimal list-inside space-y-2">
            <li>Set the base URL for each agent (your FastAPI endpoints)</li>
            <li>Add API keys if your agents require authentication</li>
            <li>Test each connection to ensure they're working</li>
            <li>The conversation agent (Agent 9) will be used for the main chat interface</li>
            <li>Other agents can be called by the conversation agent as needed</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
