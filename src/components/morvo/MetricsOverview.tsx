
import { Users, Heart, MessageSquare, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    title: "Total Followers",
    value: "2.6M",
    change: "+12.5%",
    changeText: "from last month",
    trend: "up" as const,
    icon: Users,
    iconBg: "bg-blue-500",
    iconColor: "text-white"
  },
  {
    title: "Engagement Rate", 
    value: "4.8%",
    change: "+2.1%",
    changeText: "from last month",
    trend: "up" as const,
    icon: Heart,
    iconBg: "bg-pink-500",
    iconColor: "text-white"
  },
  {
    title: "Total Comments",
    value: "48.2K",
    change: "+8.3%",
    changeText: "from last month", 
    trend: "up" as const,
    icon: MessageSquare,
    iconBg: "bg-green-500",
    iconColor: "text-white"
  },
  {
    title: "Shares",
    value: "12.8K",
    change: "-3.2%",
    changeText: "from last month",
    trend: "down" as const,
    icon: Share2,
    iconBg: "bg-purple-500",
    iconColor: "text-white"
  }
];

export const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${metric.iconBg}`}>
                <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500">{metric.changeText}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
