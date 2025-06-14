
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
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeLanguageToggle } from "./ThemeLanguageToggle";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  const productLinks = [
    { title: t('product.title'), href: "/product", description: t('product.description') },
    { title: t('features.title'), href: "/features", description: t('features.description') },
    { title: t('how_it_works.title'), href: "/how-it-works", description: t('how_it_works.description') },
    { title: t('pricing.title'), href: "/pricing", description: t('pricing.description') },
  ];

  const resourcesLinks = [
    { title: t('success_stories.title'), href: "/success-stories", description: t('success_stories.description') },
    { title: t('updates.title'), href: "/updates", description: t('updates.description') },
    { title: t('help_center.title'), href: "/help-center", description: t('help_center.description') },
    { title: t('faq.title'), href: "/faq", description: t('faq.description') },
  ];

  const supportLinks = [
    { title: t('support.title'), href: "/support", description: t('support.description') },
    { title: t('contact.title'), href: "/contact", description: t('contact.description') },
    { title: t('status.title'), href: "/status", description: t('status.description') },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
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
            <span className="text-xl font-bold text-gray-900 dark:text-white">Morvo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList className="gap-6">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800 text-gray-900 dark:text-white">
                    {t('nav.product')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6 bg-white dark:bg-gray-800">
                      {productLinks.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className={`text-sm font-medium leading-none ${language === 'ar' ? 'text-right' : 'text-left'} text-gray-900 dark:text-white`}>
                              {link.title}
                            </div>
                            <p className={`text-sm leading-snug text-gray-600 dark:text-gray-300 mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800 text-gray-900 dark:text-white">
                    {t('nav.resources')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6 bg-white dark:bg-gray-800">
                      {resourcesLinks.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className={`text-sm font-medium leading-none ${language === 'ar' ? 'text-right' : 'text-left'} text-gray-900 dark:text-white`}>
                              {link.title}
                            </div>
                            <p className={`text-sm leading-snug text-gray-600 dark:text-gray-300 mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                              {link.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=open]:bg-gray-50 dark:data-[state=open]:bg-gray-800 text-gray-900 dark:text-white">
                    {t('nav.support')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-6 bg-white dark:bg-gray-800">
                      {supportLinks.map((link) => (
                        <NavigationMenuLink key={link.href} asChild>
                          <Link
                            to={link.href}
                            className="block select-none rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className={`text-sm font-medium leading-none ${language === 'ar' ? 'text-right' : 'text-left'} text-gray-900 dark:text-white`}>
                              {link.title}
                            </div>
                            <p className={`text-sm leading-snug text-gray-600 dark:text-gray-300 mt-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
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

          {/* Theme and Language Toggles + Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeLanguageToggle />
            <Button variant="ghost" asChild>
              <Link to="/auth">{t('nav.login')}</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">{t('nav.start_free')}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="space-y-4">
              {/* Theme and Language Toggles */}
              <div className="px-4">
                <ThemeLanguageToggle />
              </div>

              {/* Product Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 px-4">{t('nav.product')}</h3>
                <div className={`space-y-2 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                  {productLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Resources Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 px-4">{t('nav.resources')}</h3>
                <div className={`space-y-2 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 px-4">{t('nav.support')}</h3>
                <div className={`space-y-2 ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                  {supportLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm px-4 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 px-4">
                  <Button variant="ghost" className="w-full justify-center" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      {t('nav.login')}
                    </Link>
                  </Button>
                  <Button className="w-full justify-center" asChild>
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      {t('nav.start_free')}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
