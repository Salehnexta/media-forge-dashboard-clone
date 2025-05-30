
import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-slate-300">Welcome back! Here's what's happening with your business today.</p>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
