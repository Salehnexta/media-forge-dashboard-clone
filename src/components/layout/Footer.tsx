
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <img src="/lovable-uploads/106e73d9-6931-4d1f-baf9-41e6e1e2e440.png" alt="Morvo Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold">Morvo</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {t('footer.brand_description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 dark:bg-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('nav.product')}</h3>
            <div className="space-y-2">
              <Link to="/product" className="block text-gray-300 hover:text-white transition-colors">
                {t('product.title')}
              </Link>
              <Link to="/features" className="block text-gray-300 hover:text-white transition-colors">
                {t('features.title')}
              </Link>
              <Link to="/how-it-works" className="block text-gray-300 hover:text-white transition-colors">
                {t('how_it_works.title')}
              </Link>
              <Link to="/pricing" className="block text-gray-300 hover:text-white transition-colors">
                {t('pricing.title')}
              </Link>
              <Link to="/ai-analysis" className="block text-gray-300 hover:text-white transition-colors">
                {t('ai_analysis.title')}
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('nav.resources')}</h3>
            <div className="space-y-2">
              <Link to="/success-stories" className="block text-gray-300 hover:text-white transition-colors">
                {t('success_stories.title')}
              </Link>
              <Link to="/updates" className="block text-gray-300 hover:text-white transition-colors">
                {t('updates.title')}
              </Link>
              <Link to="/help-center" className="block text-gray-300 hover:text-white transition-colors">
                {t('help_center.title')}
              </Link>
              <Link to="/faq" className="block text-gray-300 hover:text-white transition-colors">
                {t('faq.title')}
              </Link>
            </div>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.legal')}</h3>
            <div className="space-y-2">
              <Link to="/support" className="block text-gray-300 hover:text-white transition-colors">
                {t('support.title')}
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                {t('contact.title')}
              </Link>
              <Link to="/status" className="block text-gray-300 hover:text-white transition-colors">
                {t('status.title')}
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">info@morvo.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 font-normal text-left">+966 500921889</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">{t('location')}</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
