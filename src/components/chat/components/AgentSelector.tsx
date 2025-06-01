
import React from 'react';
import { AIManager } from '@/types/morvo';
import { agentInfo } from '../constants';

interface AgentSelectorProps {
  currentAgent: AIManager;
  onAgentChange: (agent: AIManager) => void;
}

export const AgentSelector = ({ currentAgent, onAgentChange }: AgentSelectorProps) => {
  return (
    <div className="p-3 border-b">
      <select
        value={currentAgent}
        onChange={(e) => onAgentChange(e.target.value as AIManager)}
        className="w-full p-2 border rounded-lg text-sm"
      >
        {Object.entries(agentInfo).map(([key, info]) => (
          <option key={key} value={key}>
            {info.name} - {info.description}
          </option>
        ))}
      </select>
    </div>
  );
};
