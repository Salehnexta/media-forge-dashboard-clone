
import { ArrowUp, ArrowDown, DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "from-green-400 to-emerald-600"
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    trend: "up",
    icon: ShoppingCart,
    color: "from-purple-400 to-purple-600"
  },
  {
    title: "Growth Rate",
    value: "+573",
    change: "+201%",
    trend: "up",
    icon: TrendingUp,
    color: "from-orange-400 to-red-600"
  }
];

export const MetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color}`}>
              <metric.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metric.value}</div>
            <div className="flex items-center text-xs text-slate-300 mt-1">
              {metric.trend === "up" ? (
                <ArrowUp className="w-3 h-3 text-green-400 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-400 mr-1" />
              )}
              <span className={metric.trend === "up" ? "text-green-400" : "text-red-400"}>
                {metric.change}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
