
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "created a new project",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: 2,
    user: "Sarah Wilson",
    action: "updated user profile",
    time: "5 minutes ago",
    status: "info"
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "deleted 3 files",
    time: "10 minutes ago",
    status: "warning"
  },
  {
    id: 4,
    user: "Emma Davis",
    action: "completed task #1234",
    time: "15 minutes ago",
    status: "success"
  },
  {
    id: 5,
    user: "Alex Brown",
    action: "reported an issue",
    time: "20 minutes ago",
    status: "error"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "success": return "bg-green-500/20 text-green-400 border-green-500/20";
    case "warning": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/20";
    case "error": return "bg-red-500/20 text-red-400 border-red-500/20";
    default: return "bg-blue-500/20 text-blue-400 border-blue-500/20";
  }
};

export const RecentActivity = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-600 text-white">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.user}
                  </p>
                  <p className="text-sm text-slate-300 truncate">
                    {activity.action}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-slate-400">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Server Uptime</span>
              <span className="text-green-400 font-semibold">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Response Time</span>
              <span className="text-blue-400 font-semibold">245ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active Sessions</span>
              <span className="text-purple-400 font-semibold">1,234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Cache Hit Rate</span>
              <span className="text-orange-400 font-semibold">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Error Rate</span>
              <span className="text-red-400 font-semibold">0.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Database Queries</span>
              <span className="text-cyan-400 font-semibold">15.2k</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
