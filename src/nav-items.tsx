
import { Home, BarChart3, Settings, Users, FileText } from "lucide-react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard", 
    to: "/dashboard",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Features",
    to: "/features", 
    icon: <Settings className="h-4 w-4" />,
    page: <Features />,
  },
  {
    title: "Pricing",
    to: "/pricing",
    icon: <Users className="h-4 w-4" />,
    page: <Pricing />,
  },
  {
    title: "Contact",
    to: "/contact",
    icon: <FileText className="h-4 w-4" />,
    page: <Contact />,
  },
];
