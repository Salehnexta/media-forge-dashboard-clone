
import { ReactNode } from "react";
import { PageHeader } from "./PageHeader";
import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actionButton?: {
    label: string;
    href: string;
    variant?: "default" | "outline" | "secondary";
  };
}

export const PageLayout = ({ children, title, description, breadcrumbs, actionButton }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <PageHeader 
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actionButton={actionButton}
      />
      <main className="py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};
