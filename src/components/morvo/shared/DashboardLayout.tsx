
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  children: ReactNode;
  headerActions?: ReactNode;
}

export const DashboardLayout = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  headerActions 
}: DashboardLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-gray-600 text-sm lg:text-base mt-1">{description}</p>
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      </div>
      
      <div className={`${isMobile ? 'space-y-4' : 'space-y-6'}`}>
        {children}
      </div>
    </div>
  );
};
