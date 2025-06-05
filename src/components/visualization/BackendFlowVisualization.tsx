
import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Zap, Globe, Server, Bot, FileText, BarChart3 } from 'lucide-react';

const BackendFlowVisualization = () => {
  const initialNodes: Node[] = [
    // Frontend Layer
    {
      id: 'frontend',
      type: 'input',
      position: { x: 400, y: 50 },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Frontend (React)</span>
          </div>
        )
      },
      style: { background: '#e3f2fd', border: '2px solid #2196f3' }
    },
    
    // Authentication
    {
      id: 'auth',
      position: { x: 200, y: 150 },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-2">
            <Database className="w-4 h-4 text-green-500" />
            <span>Supabase Auth</span>
          </div>
        )
      },
      style: { background: '#e8f5e8', border: '2px solid #4caf50' }
    },

    // Main Database
    {
      id: 'database',
      position: { x: 600, y: 150 },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-2">
            <Database className="w-4 h-4 text-green-500" />
            <span>Supabase Database</span>
          </div>
        )
      },
      style: { background: '#e8f5e8', border: '2px solid #4caf50' }
    },

    // Edge Functions
    {
      id: 'edge-functions',
      position: { x: 400, y: 250 },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-2">
            <Server className="w-4 h-4 text-purple-500" />
            <span>Edge Functions</span>
          </div>
        )
      },
      style: { background: '#f3e5f5', border: '2px solid #9c27b0' }
    },

    // Specific Edge Functions
    {
      id: 'website-analyzer',
      position: { x: 100, y: 350 },
      data: { 
        label: (
          <div className="text-center p-2">
            <FileText className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-xs">Website Analyzer</div>
            <div className="text-xs text-gray-500">(Perplexity AI)</div>
          </div>
        )
      },
      style: { background: '#fff3e0', border: '2px solid #ff9800', width: 120 }
    },

    {
      id: 'document-analyzer',
      position: { x: 250, y: 350 },
      data: { 
        label: (
          <div className="text-center p-2">
            <FileText className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-xs">Document Analyzer</div>
            <div className="text-xs text-gray-500">(AI Analysis)</div>
          </div>
        )
      },
      style: { background: '#fff3e0', border: '2px solid #ff9800', width: 120 }
    },

    {
      id: 'marketing-analysis',
      position: { x: 400, y: 350 },
      data: { 
        label: (
          <div className="text-center p-2">
            <BarChart3 className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-xs">Marketing Analysis</div>
            <div className="text-xs text-gray-500">(AI Marketing)</div>
          </div>
        )
      },
      style: { background: '#fff3e0', border: '2px solid #ff9800', width: 120 }
    },

    {
      id: 'email-service',
      position: { x: 550, y: 350 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Server className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-xs">Email Service</div>
            <div className="text-xs text-gray-500">(Resend API)</div>
          </div>
        )
      },
      style: { background: '#fff3e0', border: '2px solid #ff9800', width: 120 }
    },

    {
      id: 'payment-service',
      position: { x: 700, y: 350 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Server className="w-4 h-4 text-orange-500 mx-auto mb-1" />
            <div className="text-xs">Payment Service</div>
            <div className="text-xs text-gray-500">(Moyasar)</div>
          </div>
        )
      },
      style: { background: '#fff3e0', border: '2px solid #ff9800', width: 120 }
    },

    // Railway AI Integration
    {
      id: 'railway-ai',
      position: { x: 400, y: 450 },
      data: { 
        label: (
          <div className="flex items-center gap-2 p-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Railway AI Platform</span>
          </div>
        )
      },
      style: { background: '#fffde7', border: '2px solid #ffeb3b' }
    },

    // AI Agents
    {
      id: 'strategic-agent',
      position: { x: 100, y: 550 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Bot className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-xs">Strategic Agent</div>
            <div className="text-xs text-gray-500">M1 - Strategic</div>
          </div>
        )
      },
      style: { background: '#e3f2fd', border: '2px solid #2196f3', width: 110 }
    },

    {
      id: 'monitor-agent',
      position: { x: 230, y: 550 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Bot className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-xs">Monitor Agent</div>
            <div className="text-xs text-gray-500">M2 - Social Media</div>
          </div>
        )
      },
      style: { background: '#e3f2fd', border: '2px solid #2196f3', width: 110 }
    },

    {
      id: 'executor-agent',
      position: { x: 360, y: 550 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Bot className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-xs">Executor Agent</div>
            <div className="text-xs text-gray-500">M3 - Campaigns</div>
          </div>
        )
      },
      style: { background: '#e3f2fd', border: '2px solid #2196f3', width: 110 }
    },

    {
      id: 'creative-agent',
      position: { x: 490, y: 550 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Bot className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-xs">Creative Agent</div>
            <div className="text-xs text-gray-500">M4 - Content</div>
          </div>
        )
      },
      style: { background: '#e3f2fd', border: '2px solid #2196f3', width: 110 }
    },

    {
      id: 'analyst-agent',
      position: { x: 620, y: 550 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Bot className="w-4 h-4 text-blue-500 mx-auto mb-1" />
            <div className="text-xs">Analyst Agent</div>
            <div className="text-xs text-gray-500">M5 - Analytics</div>
          </div>
        )
      },
      style: { background: '#e3f2fd', border: '2px solid #2196f3', width: 110 }
    },

    // External APIs
    {
      id: 'perplexity-api',
      position: { x: 50, y: 450 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Globe className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs">Perplexity AI</div>
            <div className="text-xs text-gray-500">Web Analysis</div>
          </div>
        )
      },
      style: { background: '#e8eaf6', border: '2px solid #3f51b5', width: 100 }
    },

    {
      id: 'openai-api',
      position: { x: 750, y: 450 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Globe className="w-4 h-4 text-indigo-500 mx-auto mb-1" />
            <div className="text-xs">OpenAI API</div>
            <div className="text-xs text-gray-500">AI Processing</div>
          </div>
        )
      },
      style: { background: '#e8eaf6', border: '2px solid #3f51b5', width: 100 }
    },

    // Database Tables (grouped)
    {
      id: 'company-tables',
      position: { x: 800, y: 200 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Database className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <div className="text-xs font-semibold">Company Data</div>
            <div className="text-xs text-gray-600">company_profiles</div>
            <div className="text-xs text-gray-600">company_analysis</div>
            <div className="text-xs text-gray-600">competitors</div>
          </div>
        )
      },
      style: { background: '#e0f2f1', border: '2px solid #009688', width: 120 }
    },

    {
      id: 'agent-tables',
      position: { x: 950, y: 200 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Database className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <div className="text-xs font-semibold">Agent Data</div>
            <div className="text-xs text-gray-600">agent_results</div>
            <div className="text-xs text-gray-600">agent_memories</div>
            <div className="text-xs text-gray-600">cross_agent_context</div>
          </div>
        )
      },
      style: { background: '#e0f2f1', border: '2px solid #009688', width: 120 }
    },

    {
      id: 'campaign-tables',
      position: { x: 800, y: 320 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Database className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <div className="text-xs font-semibold">Campaign Data</div>
            <div className="text-xs text-gray-600">marketing_campaigns</div>
            <div className="text-xs text-gray-600">campaign_metrics</div>
            <div className="text-xs text-gray-600">content_calendar</div>
          </div>
        )
      },
      style: { background: '#e0f2f1', border: '2px solid #009688', width: 120 }
    },

    {
      id: 'social-tables',
      position: { x: 950, y: 320 },
      data: { 
        label: (
          <div className="text-center p-2">
            <Database className="w-4 h-4 text-teal-500 mx-auto mb-1" />
            <div className="text-xs font-semibold">Social Data</div>
            <div className="text-xs text-gray-600">social_accounts</div>
            <div className="text-xs text-gray-600">social_mentions</div>
            <div className="text-xs text-gray-600">social_monitoring</div>
          </div>
        )
      },
      style: { background: '#e0f2f1', border: '2px solid #009688', width: 120 }
    }
  ];

  const initialEdges: Edge[] = [
    // Frontend to services
    { id: 'e1', source: 'frontend', target: 'auth', animated: true, style: { stroke: '#4caf50' } },
    { id: 'e2', source: 'frontend', target: 'database', animated: true, style: { stroke: '#4caf50' } },
    { id: 'e3', source: 'frontend', target: 'edge-functions', animated: true, style: { stroke: '#9c27b0' } },

    // Edge functions to specific services
    { id: 'e4', source: 'edge-functions', target: 'website-analyzer', style: { stroke: '#ff9800' } },
    { id: 'e5', source: 'edge-functions', target: 'document-analyzer', style: { stroke: '#ff9800' } },
    { id: 'e6', source: 'edge-functions', target: 'marketing-analysis', style: { stroke: '#ff9800' } },
    { id: 'e7', source: 'edge-functions', target: 'email-service', style: { stroke: '#ff9800' } },
    { id: 'e8', source: 'edge-functions', target: 'payment-service', style: { stroke: '#ff9800' } },

    // Edge functions to Railway AI
    { id: 'e9', source: 'edge-functions', target: 'railway-ai', animated: true, style: { stroke: '#ffeb3b' } },

    // Railway AI to agents
    { id: 'e10', source: 'railway-ai', target: 'strategic-agent', style: { stroke: '#2196f3' } },
    { id: 'e11', source: 'railway-ai', target: 'monitor-agent', style: { stroke: '#2196f3' } },
    { id: 'e12', source: 'railway-ai', target: 'executor-agent', style: { stroke: '#2196f3' } },
    { id: 'e13', source: 'railway-ai', target: 'creative-agent', style: { stroke: '#2196f3' } },
    { id: 'e14', source: 'railway-ai', target: 'analyst-agent', style: { stroke: '#2196f3' } },

    // External APIs
    { id: 'e15', source: 'website-analyzer', target: 'perplexity-api', style: { stroke: '#3f51b5' } },
    { id: 'e16', source: 'marketing-analysis', target: 'openai-api', style: { stroke: '#3f51b5' } },

    // Database connections
    { id: 'e17', source: 'database', target: 'company-tables', style: { stroke: '#009688' } },
    { id: 'e18', source: 'database', target: 'agent-tables', style: { stroke: '#009688' } },
    { id: 'e19', source: 'database', target: 'campaign-tables', style: { stroke: '#009688' } },
    { id: 'e20', source: 'database', target: 'social-tables', style: { stroke: '#009688' } },

    // Data flow back to database
    { id: 'e21', source: 'strategic-agent', target: 'agent-tables', style: { stroke: '#009688', strokeDasharray: '5,5' } },
    { id: 'e22', source: 'monitor-agent', target: 'social-tables', style: { stroke: '#009688', strokeDasharray: '5,5' } },
    { id: 'e23', source: 'executor-agent', target: 'campaign-tables', style: { stroke: '#009688', strokeDasharray: '5,5' } },
    { id: 'e24', source: 'creative-agent', target: 'campaign-tables', style: { stroke: '#009688', strokeDasharray: '5,5' } },
    { id: 'e25', source: 'analyst-agent', target: 'agent-tables', style: { stroke: '#009688', strokeDasharray: '5,5' } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({}), []);

  return (
    <Card className="w-full h-[800px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Backend Flow Visualization
        </CardTitle>
        <p className="text-sm text-gray-600">
          Complete architecture showing data flow from frontend through Supabase to Railway AI agents
        </p>
      </CardHeader>
      <CardContent className="h-full p-0">
        <div style={{ width: '100%', height: '700px' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="top-right"
          >
            <Controls />
            <MiniMap 
              zoomable 
              pannable 
              style={{
                height: 120,
                background: '#f8f9fa'
              }}
            />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-semibold mb-2">Data Flow</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-green-500"></div>
                  <span>Real-time connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-gray-400" style={{ borderTop: '1px dashed' }}></div>
                  <span>Data storage</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Components</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Frontend/UI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Supabase Services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>Railway AI</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">External Services</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-100 border border-indigo-300 rounded"></div>
                  <span>Third-party APIs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-100 border border-teal-300 rounded"></div>
                  <span>Database Tables</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendFlowVisualization;
