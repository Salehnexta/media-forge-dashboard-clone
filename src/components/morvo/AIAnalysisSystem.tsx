
import { useState } from 'react';
import { 
  Globe, Search, Brain, Target, BarChart3, Clock, 
  CheckCircle, AlertCircle, Download, Play, RefreshCw,
  TrendingUp, Users, DollarSign, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisResult {
  website: string;
  perplexityData: {
    company: any;
    competitors: any;
    market: any;
    digitalPresence: any;
  };
  strategy: {
    strategy: string;
    timestamp: string;
    model: string;
  };
  workflow: {
    phases: Array<{
      name: string;
      duration: string;
      tasks: string[];
    }>;
    priorities: Array<{
      task: string;
      priority: string;
      impact: string;
    }>;
  };
  summary: {
    analysisDate: string;
    status: string;
    estimatedBudget: string;
    expectedTimeframe: string;
  };
}

export const AIAnalysisSystem = () => {
  const [website, setWebsite] = useState('');
  const [currentStep, setCurrentStep] = useState<'input' | 'analyzing' | 'results'>('input');
  const [analysisPhase, setAnalysisPhase] = useState<'perplexity' | 'gpt4' | 'complete'>('perplexity');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCompany = async () => {
    if (!website.trim()) {
      setError('يرجى إدخال موقع الشركة');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep('analyzing');
    setAnalysisPhase('perplexity');

    try {
      console.log('🔍 بدء التحليل للموقع:', website);

      const { data, error: functionError } = await supabase.functions.invoke('ai-marketing-analysis', {
        body: {
          website: website.trim(),
          step: 'complete'
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'حدث خطأ في التحليل');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setCurrentStep('results');
      console.log('✅ تم التحليل بنجاح');

    } catch (err: any) {
      console.error('خطأ في التحليل:', err);
      setError(err.message || 'حدث خطأ غير متوقع');
      setCurrentStep('input');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('input');
    setResult(null);
    setError(null);
    setWebsite('');
  };

  const exportResults = () => {
    if (!result) return;

    const exportData = {
      analysisDate: new Date().toLocaleString('ar-SA'),
      website: result.website,
      summary: result.summary,
      strategy: result.strategy.strategy,
      workflow: result.workflow
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تحليل-تسويقي-${result.website.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Input Phase
  if (currentStep === 'input') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            نظام التحليل التسويقي الذكي
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            تحليل شامل بالذكاء الاصطناعي باستخدام Perplexity AI و GPT-4o
          </p>
        </div>

        <Card className="bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-900">
              ابدأ تحليل شركتك
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                موقع الشركة الإلكتروني
              </label>
              <div className="relative">
                <Globe className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="pr-10 text-lg py-3"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">ما ستحصل عليه:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">تحليل الشركة والمنافسين</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">تحليل السوق والفرص</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">استراتيجية تسويقية مخصصة</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">خطة عمل تنفيذية</span>
                </div>
              </div>
            </div>

            <Button
              onClick={analyzeCompany}
              disabled={loading || !website.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-medium"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  جاري التحليل...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  ابدأ التحليل الذكي
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Analysis Phase
  if (currentStep === 'analyzing') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            جاري تحليل الشركة...
          </h2>
          <p className="text-gray-600">يرجى الانتظار بينما نحلل البيانات</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">المرحلة 1: جمع البيانات</h3>
                  <p className="text-sm text-gray-600">تحليل الشركة والمنافسين باستخدام Perplexity AI</p>
                </div>
                <div className="mr-auto">
                  <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg opacity-60">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">المرحلة 2: إنشاء الاستراتيجية</h3>
                  <p className="text-sm text-gray-400">تحليل البيانات وإنشاء استراتيجية بـ GPT-4o</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full w-0"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg opacity-40">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500">المرحلة 3: خطة العمل</h3>
                  <p className="text-sm text-gray-400">تنسيق الأولويات والجدول الزمني</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full w-0"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Phase
  if (currentStep === 'results' && result) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">تم التحليل بنجاح!</h2>
          </div>
          <p className="text-gray-600">تحليل شامل لموقع: {result.website}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">الحالة</h3>
              <p className="text-sm text-blue-700">{result.summary.status}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-900">الميزانية المقترحة</h3>
              <p className="text-sm text-green-700">{result.summary.estimatedBudget}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-purple-900">الإطار الزمني</h3>
              <p className="text-sm text-purple-700">{result.summary.expectedTimeframe}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-semibold text-orange-900">الأولويات</h3>
              <p className="text-sm text-orange-700">{result.workflow.priorities.length} مهام</p>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Section */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-blue-600" />
              الاستراتيجية التسويقية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-['Cairo']">
                {result.strategy.strategy}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                خطة التنفيذ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.workflow.phases.map((phase, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{phase.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">المدة: {phase.duration}</p>
                    <ul className="space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="text-sm text-gray-700 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-6 h-6 text-red-600" />
                الأولويات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.workflow.priorities.map((priority, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{priority.task}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priority.priority === 'عالية' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {priority.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">التأثير المتوقع:</span>
                      <span className="font-medium text-green-600">{priority.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={resetAnalysis}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            تحليل جديد
          </Button>
          
          <Button
            onClick={exportResults}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            تصدير النتائج
          </Button>
          
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            <Play className="w-4 h-4" />
            بدء التنفيذ
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
