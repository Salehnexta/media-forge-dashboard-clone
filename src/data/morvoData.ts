import { ManagerInfo } from "@/types/morvo";

export const aiManagers: ManagerInfo[] = [
  {
    id: "strategic",
    name: "الاستراتيجي",
    description: "يخطط للرؤية والأولويات الخاصة بالميزانية",
    personality: "قائد حكيم بعقلية المدير التنفيذي",
    color: "#3b82f6"
  },
  {
    id: "monitor",
    name: "المراقب",
    description: "يراقب وسائل التواصل ويحلل تفاعل الجمهور",
    personality: "متحمس، مبدع، قريب من الاتجاهات",
    color: "#10b981"
  },
  {
    id: "executor",
    name: "المنفذ",
    description: "يدير الحملات ويحسن الأداء تلقائياً",
    personality: "محلل دقيق، مهووس بالأرقام",
    color: "#f59e0b"
  },
  {
    id: "creative",
    name: "المبدع",
    description: "ينتج المحتوى ويضع استراتيجيات إبداعية",
    personality: "مبدع بحس فني، يفهم قوة القصص",
    color: "#8b5cf6"
  },
  {
    id: "analyst",
    name: "المحلل",
    description: "يجمع البيانات ويكتشف الشاذ ويقدم توقعات",
    personality: "تحليلي، دقيق، يحب الغوص في التفاصيل",
    color: "#ef4444"
  }
];

export const mockChartData = {
  strategic: {
    roi: [
      { month: "يناير", actual: 85000, expected: 80000 },
      { month: "فبراير", actual: 90000, expected: 85000 },
      { month: "مارس", actual: 95000, expected: 90000 },
      { month: "أبريل", actual: 105000, expected: 95000 },
      { month: "مايو", actual: 110000, expected: 100000 },
      { month: "يونيو", actual: 120000, expected: 105000 }
    ],
    budget: [
      { name: "السوشيال ميديا", value: 35, color: "#3b82f6" },
      { name: "البحث المدفوع", value: 25, color: "#10b981" },
      { name: "البريد الإلكتروني", value: 15, color: "#f59e0b" },
      { name: "المحتوى", value: 15, color: "#8b5cf6" },
      { name: "العلاقات العامة", value: 10, color: "#ef4444" }
    ]
  },
  monitor: {
    sentiment: [
      { month: "يناير", positive: 65, negative: 20, neutral: 15 },
      { month: "فبراير", positive: 70, negative: 18, neutral: 12 },
      { month: "مارس", positive: 75, negative: 15, neutral: 10 },
      { month: "أبريل", positive: 80, negative: 12, neutral: 8 },
      { month: "مايو", positive: 78, negative: 14, neutral: 8 },
      { month: "يونيو", positive: 82, negative: 10, neutral: 8 }
    ],
    mentions: [
      { platform: "إنستغرام", mentions: 1250 },
      { platform: "فيسبوك", mentions: 980 },
      { platform: "تويتر", mentions: 750 },
      { platform: "لينكد إن", mentions: 420 },
      { platform: "تيك توك", mentions: 890 }
    ]
  },
  executor: {
    ctr: [
      { campaign: "حملة الصيف", ctr: 4.2 },
      { campaign: "حملة العودة للمدرسة", ctr: 3.8 },
      { campaign: "حملة الشتاء", ctr: 5.1 },
      { campaign: "حملة رمضان", ctr: 6.2 },
      { campaign: "حملة العيد", ctr: 7.1 }
    ],
    roas: [
      { month: "يناير", roas: 3.2 },
      { month: "فبراير", roas: 3.8 },
      { month: "مارس", roas: 4.1 },
      { month: "أبريل", roas: 4.5 },
      { month: "مايو", roas: 4.8 },
      { month: "يونيو", roas: 5.2 }
    ]
  },
  creative: {
    contentPerformance: [
      { type: "فيديو", performance: 85 },
      { type: "صور", performance: 72 },
      { type: "نصوص", performance: 68 },
      { type: "انفوجرافيك", performance: 79 },
      { type: "مقالات", performance: 65 }
    ],
    qualityRadar: [
      { metric: "الجاذبية", score: 85 },
      { metric: "الوضوح", score: 90 },
      { metric: "التحسين", score: 75 },
      { metric: "التفاعل", score: 88 },
      { metric: "الأصالة", score: 92 },
      { metric: "التوقيت", score: 80 }
    ]
  },
  analyst: {
    keywords: [
      { month: "يناير", ranking: 15 },
      { month: "فبراير", ranking: 12 },
      { month: "مارس", ranking: 8 },
      { month: "أبريل", ranking: 6 },
      { month: "مايو", ranking: 4 },
      { month: "يونيو", ranking: 3 }
    ],
    traffic: [
      { month: "يناير", organic: 45000, paid: 25000, referral: 15000 },
      { month: "فبراير", organic: 52000, paid: 28000, referral: 18000 },
      { month: "مارس", organic: 58000, paid: 32000, referral: 20000 },
      { month: "أبريل", organic: 65000, paid: 35000, referral: 22000 },
      { month: "مايو", organic: 72000, paid: 38000, referral: 25000 },
      { month: "يونيو", organic: 78000, paid: 42000, referral: 28000 }
    ]
  }
};
