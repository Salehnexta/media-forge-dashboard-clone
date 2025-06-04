import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react";
export const Footer = () => {
  return <footer className="bg-gray-900 text-white" dir="rtl">
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
              منصة التسويق الذكي المتكاملة التي تساعدك على تحليل السوق وبناء استراتيجيات تسويقية فعالة باستخدام الذكاء الاصطناعي.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المنتج</h3>
            <div className="space-y-2">
              <Link to="/product" className="block text-gray-300 hover:text-white transition-colors">
                المنتج
              </Link>
              <Link to="/features" className="block text-gray-300 hover:text-white transition-colors">
                المميزات
              </Link>
              <Link to="/how-it-works" className="block text-gray-300 hover:text-white transition-colors">
                كيف يعمل
              </Link>
              <Link to="/pricing" className="block text-gray-300 hover:text-white transition-colors">
                الأسعار
              </Link>
              <Link to="/ai-analysis" className="block text-gray-300 hover:text-white transition-colors">
                التحليل الذكي
              </Link>
            </div>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">المصادر</h3>
            <div className="space-y-2">
              <Link to="/success-stories" className="block text-gray-300 hover:text-white transition-colors">
                قصص النجاح
              </Link>
              <Link to="/updates" className="block text-gray-300 hover:text-white transition-colors">
                التحديثات
              </Link>
              <Link to="/help-center" className="block text-gray-300 hover:text-white transition-colors">
                مركز المساعدة
              </Link>
              <Link to="/faq" className="block text-gray-300 hover:text-white transition-colors">
                الأسئلة الشائعة
              </Link>
            </div>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">الدعم والقانونية</h3>
            <div className="space-y-2">
              <Link to="/support" className="block text-gray-300 hover:text-white transition-colors">
                الدعم
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
                تواصل معنا
              </Link>
              <Link to="/status" className="block text-gray-300 hover:text-white transition-colors">
                حالة الخدمة
              </Link>
              <Link to="/terms" className="block text-gray-300 hover:text-white transition-colors">
                الشروط والأحكام
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-white transition-colors">
                سياسة الخصوصية
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300">info@morvo.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-400" />
              <span className="text-gray-300">+966 11 234 5678</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-red-400" />
              <span className="text-gray-300">الخبر، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Morvo. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>;
};