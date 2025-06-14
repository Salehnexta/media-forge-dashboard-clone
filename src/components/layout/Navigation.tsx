
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const productLinks = [
    { title: "المنتج", href: "/product", description: "تعرف على منصة Morvo وإمكانياتها" },
    { title: "المميزات", href: "/features", description: "اكتشف جميع مميزات المنصة" },
    { title: "كيف يعمل", href: "/how-it-works", description: "تعلم كيفية استخدام المنصة" },
    { title: "الأسعار", href: "/pricing", description: "اختر الخطة المناسبة لك" },
  ];

  const resourcesLinks = [
    { title: "قصص النجاح", href: "/success-stories", description: "قصص عملائنا الناجحين" },
    { title: "التحديثات", href: "/updates", description: "آخر التحديثات والإضافات" },
    { title: "مركز المساعدة", href: "/help-center", description: "دليل استخدام شامل" },
    { title: "الأسئلة الشائعة", href: "/faq", description: "إجابات للأسئلة الشائعة" },
  ];

  const supportLinks = [
    { title: "الدعم", href: "/support", description: "تواصل مع فريق الدعم" },
    { title: "تواصل معنا", href: "/contact", description: "طرق التواصل المختلفة" },
    { title: "حالة الخدمة", href: "/status", description: "مراقبة حالة الخدمات" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" dir="rtl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" 
                alt="Morvo Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gray-900">Morvo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50">
                    المنتج
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6">
                      {productLinks.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-md p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-sm font-medium leading-none text-right">
                              {link.title}
                            </div>
                            <p className="text-sm leading-snug text-gray-600 mt-1 text-right">
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50">
                    المصادر
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6">
                      {resourcesLinks.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-md p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-sm font-medium leading-none text-right">
                              {link.title}
                            </div>
                            <p className="text-sm leading-snug text-gray-600 mt-1 text-right">
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 data-[state=open]:bg-gray-50">
                    الدعم
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6">
                      {supportLinks.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-md p-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-sm font-medium leading-none text-right">
                              {link.title}
                            </div>
                            <p className="text-sm leading-snug text-gray-600 mt-1 text-right">
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Dashboard Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button asChild>
              <Link to="/dashboard">ادخل إلى المنصة</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <div className="space-y-4">
              {/* Product Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">المنتج</h3>
                <div className="space-y-2 mr-4">
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block text-gray-600 hover:text-gray-900 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">المصادر</h3>
                <div className="space-y-2 mr-4">
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block text-gray-600 hover:text-gray-900 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">الدعم</h3>
                <div className="space-y-2 mr-4">
                  {supportLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block text-gray-600 hover:text-gray-900 text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Dashboard Button */}
              <div className="pt-4 border-t border-gray-200">
                <Button className="w-full justify-center" asChild>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    ادخل إلى المنصة
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
