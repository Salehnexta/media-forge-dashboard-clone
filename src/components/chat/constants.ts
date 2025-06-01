
import { AIManager } from '@/types/morvo';
import { SmartSuggestion, QuickChartCommand } from './types';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export const agentInfo = {
  strategic: { name: 'المدير الاستراتيجي', color: 'bg-blue-500', description: 'تحليل استراتيجي وتخطيط' },
  monitor: { name: 'مراقب الأداء', color: 'bg-green-500', description: 'مراقبة ومتابعة الأداء' },
  executor: { name: 'منفذ الحملات', color: 'bg-purple-500', description: 'تنفيذ وإدارة الحملات' },
  creative: { name: 'المبدع', color: 'bg-orange-500', description: 'إنتاج المحتوى الإبداعي' },
  analyst: { name: 'المحلل', color: 'bg-red-500', description: 'تحليل البيانات والتقارير' }
};

export const smartSuggestions: Record<AIManager, SmartSuggestion[]> = {
  strategic: [
    { question: 'أنشئ رسم بياني لتحليل SWOT لشركتي', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
    { question: 'اعرض خارطة الطريق الاستراتيجية لـ 6 أشهر', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
    { question: 'ما هي أفضل استراتيجية لدخول السوق الجديد؟', category: 'strategy' },
    { question: 'حلل موقعي التنافسي مقارنة بالمنافسين', category: 'analysis' },
    { question: 'اقترح أهداف KPI قابلة للقياس', category: 'action' }
  ],
  monitor: [
    { question: 'أنشئ رسم بياني لأداء منصات التواصل الاجتماعي', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
    { question: 'اعرض تطور معدل التفاعل خلال الشهر الماضي', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
    { question: 'كيف أحسن معدل الوصول على انستغرام؟', category: 'action' },
    { question: 'ما أفضل أوقات النشر لجمهوري؟', category: 'analysis' },
    { question: 'حلل أداء الهاشتاجات الأخيرة', category: 'analysis' }
  ],
  executor: [
    { question: 'أنشئ رسم بياني لأداء الحملات الإعلانية', category: 'chart', icon: <PieChart className="w-3 h-3" /> },
    { question: 'اعرض مقارنة تكلفة النقرة بين المنصات', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
    { question: 'كيف أقلل تكلفة الحصول على عميل جديد؟', category: 'action' },
    { question: 'ما أفضل استهداف لحملة المنتج الجديد؟', category: 'strategy' },
    { question: 'حلل معدل التحويل لحملاتي الحالية', category: 'analysis' }
  ],
  creative: [
    { question: 'أنشئ رسم بياني لأداء أنواع المحتوى المختلفة', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
    { question: 'اعرض اتجاهات المحتوى الرائج حسب المنصة', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
    { question: 'اقترح أفكار محتوى لحملة رمضان', category: 'action' },
    { question: 'ما الألوان الأنسب لهوية علامتي التجارية؟', category: 'strategy' },
    { question: 'حلل أداء الفيديوهات مقابل الصور', category: 'analysis' }
  ],
  analyst: [
    { question: 'أنشئ لوحة تحكم تفاعلية لمؤشرات الأداء', category: 'chart', icon: <BarChart3 className="w-3 h-3" /> },
    { question: 'اعرض توقعات المبيعات للربع القادم', category: 'chart', icon: <TrendingUp className="w-3 h-3" /> },
    { question: 'حلل سلوك العملاء وأنماط الشراء', category: 'analysis' },
    { question: 'ما أهم المؤشرات لقياس نجاح استراتيجيتي؟', category: 'strategy' },
    { question: 'اقترح تحسينات بناءً على البيانات الحالية', category: 'action' }
  ]
};

export const quickChartCommands: QuickChartCommand[] = [
  { command: '/رسم-دائري', description: 'إنشاء رسم بياني دائري', icon: <PieChart className="w-3 h-3" /> },
  { command: '/رسم-أعمدة', description: 'إنشاء رسم أعمدة بيانية', icon: <BarChart3 className="w-3 h-3" /> },
  { command: '/رسم-خطي', description: 'إنشاء رسم بياني خطي', icon: <TrendingUp className="w-3 h-3" /> },
  { command: '/لوحة-تحكم', description: 'إنشاء لوحة تحكم شاملة', icon: <BarChart3 className="w-3 h-3" /> }
];
