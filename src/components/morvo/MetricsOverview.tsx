
import { Users, Heart, MessageSquare, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  {
    title: "Total Followers",
    value: "2.6M",
    change: "+12.5% from last month",
    trend: "up" as const,
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Engagement Rate", 
    value: "4.8%",
    change: "+2.1% from last month",
    trend: "up" as const,
    icon: Heart,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600"
  },
  {
    title: "Total Comments",
    value: "48.2K",
    change: "+8.3% from last month", 
    trend: "up" as const,
    icon: MessageSquare,
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Shares",
    value: "12.8K",
    change: "-3.2% from last month",
    trend: "down" as const,
    icon: Share2,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  }
];

export const MetricsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.iconBg}`}>
                <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{metric.title}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              <p className={`text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {metric.change}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
