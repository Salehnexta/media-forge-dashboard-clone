
import { Users, Heart, MessageSquare, Share2, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "إجمالي المتابعين",
    value: "45,231",
    change: "+20.1%",
    trend: "up" as const,
    icon: Users,
    gradient: "from-green-400 to-emerald-600"
  },
  {
    title: "معدل التفاعل",
    value: "12.4%",
    change: "+5.2%",
    trend: "up" as const,
    icon: Heart,
    gradient: "from-pink-400 to-red-600"
  },
  {
    title: "إجمالي التعليقات",
    value: "8,492",
    change: "+12.8%",
    trend: "up" as const,
    icon: MessageSquare,
    gradient: "from-blue-400 to-blue-600"
  },
  {
    title: "المشاركات",
    value: "2,104",
    change: "-3.1%",
    trend: "down" as const,
    icon: Share2,
    gradient: "from-purple-400 to-purple-600"
  }
];

export const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white/20 border-white/30 backdrop-blur-sm hover:bg-white/25 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-l ${metric.gradient}`}>
              <metric.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            <div className="flex items-center text-xs mt-1">
              {metric.trend === "up" ? (
                <ArrowUp className="w-3 h-3 text-green-500 ml-1" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500 ml-1" />
              )}
              <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                {metric.change}
              </span>
              <span className="text-gray-500 mr-1">من الشهر الماضي</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
