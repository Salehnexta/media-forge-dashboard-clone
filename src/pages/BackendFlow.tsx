
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import BackendFlowVisualization from '@/components/visualization/BackendFlowVisualization';

const BackendFlow = () => {
  return (
    <PageLayout
      title="Backend Architecture Flow"
      description="Interactive visualization of the complete backend architecture showing data flow from frontend through Supabase to Railway AI agents and external services."
    >
      <div className="container mx-auto p-6">
        <BackendFlowVisualization />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-3 text-blue-600">Frontend Layer</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• React-based user interface</li>
              <li>• Real-time dashboard updates</li>
              <li>• Authentication integration</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-3 text-green-600">Supabase Backend</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• PostgreSQL database</li>
              <li>• Row-level security (RLS)</li>
              <li>• Edge Functions</li>
              <li>• Real-time subscriptions</li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-3 text-yellow-600">Railway AI Platform</h3>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>• 5 specialized AI agents</li>
              <li>• Strategic analysis</li>
              <li>• Campaign management</li>
              <li>• Content generation</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BackendFlow;
