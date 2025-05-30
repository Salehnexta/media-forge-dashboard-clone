
export type AIManager = "strategic" | "monitor" | "executor" | "creative" | "analyst";

export interface ManagerInfo {
  id: AIManager;
  name: string;
  description: string;
  personality: string;
  color: string;
}

export interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
  gradient: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  manager: AIManager;
}
