
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Lightbulb, Target, TrendingUp, AlertCircle } from "lucide-react";
import { AIManager } from "@/types/morvo";
import { aiManagers } from "@/data/morvoData";

interface AIInsightsProps {
  selectedManager: AIManager;
}

const insights = {
  strategic: [
    {
      icon: Target,
      title: "تحسين الميزانية",
      description: "يُنصح بزيادة الاستثمار في وسائل التواصل الاجتماعي بنسبة 15% لتحقيق عائد أفضل",
      priority: "high"
    },
    {
      icon: TrendingUp,
      title: "فرصة نمو",
      description: "الاتجاهات الحالية تشير إلى إمكانية زيادة الإيرادات بنسبة 25% في الربع القادم",
      priority: "medium"
    }
  ],
  monitor: [
    {
      icon: AlertCircle,
      title: "تحذير من انخفاض",
      description: "لوحظ انخفاض في التفاعل على تويتر، يُنصح بمراجعة استراتيجية المحتوى",
      priority: "high"
    },
    {
      icon: Lightbulb,
      title: "توصية المحتوى",
      description: "المحتوى المرئي يحقق تفاعلاً أعلى بنسبة 40%، ركز على الفيديوهات القصيرة",
      priority: "medium"
    }
  ],
  executor: [
    {
      icon: Target,
      title: "تحسين الحملات",
      description: "حملة 'العيد' تحقق أفضل أداء، يُنصح بتوسيع نطاقها وزيادة الميزانية",
      priority: "high"
    },
    {
      icon: TrendingUp,
      title: "تحسين الأداء",
      description: "معدل النقر يمكن تحسينه بنسبة 20% عبر تعديل العناوين والصور",
      priority: "medium"
    }
  ],
  creative: [
    {
      icon: Lightbulb,
      title: "اتجاه إبداعي جديد",
      description: "القصص التفاعلية تحقق معدل مشاركة أعلى، استخدم المزيد من الاستطلاعات",
      priority: "medium"
    },
    {
      icon: Target,
      title: "تحسين الجودة",
      description: "زيادة جودة الصور والفيديوهات بنسبة 30% ستحسن معدل التفاعل بشكل كبير",
      priority: "high"
    }
  ],
  analyst: [
    {
      icon: TrendingUp,
      title: "نمو في الكلمات المفتاحية",
      description: "ترتيب الكلمات المفتاحية تحسن بنسبة 40%، استمر في استراتيجية SEO الحالية",
      priority: "high"
    },
    {
      icon: AlertCircle,
      title: "تحليل الزيارات",
      description: "الزيارات المدفوعة تحتاج إلى تحسين، راجع استهداف الجمهور",
      priority: "medium"
    }
  ]
};

export const AIInsights = ({ selectedManager }: AIInsightsProps) => {
  const currentManager = aiManagers.find(m => m.id === selectedManager);
  const managerInsights = insights[selectedManager];

  return (
    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          رؤى ذكية من {currentManager?.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {managerInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-white/30 rounded-lg border border-white/20 hover:bg-white/40 transition-all">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.priority === "high" 
                    ? "bg-red-100 text-red-600" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  <insight.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    insight.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {insight.priority === "high" ? "أولوية عالية" : "أولوية متوسطة"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
