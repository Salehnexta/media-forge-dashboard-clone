
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actionButton?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "secondary";
  };
}

export const PageHeader = ({ title, description, breadcrumbs, actionButton }: PageHeaderProps) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6" dir="rtl">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link 
                    to={crumb.href} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight className="w-4 h-4 rotate-180" />
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="text-center lg:text-right">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {actionButton && (
            <div className="flex justify-center lg:justify-start">
              <Button 
                asChild 
                size="lg" 
                variant={actionButton.variant || "default"}
                className="flex items-center gap-2 text-lg px-8 py-4"
              >
                <Link to={actionButton.href}>
                  {actionButton.label}
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
