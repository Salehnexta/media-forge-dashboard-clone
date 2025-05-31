
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Loader2, Brain, Target, Rocket, CheckCircle, Globe, Users, AlertCircle } from 'lucide-react';
import { SocialConnectStep } from './SocialConnectStep';

interface SmartOnboardingProps {
  user: User;
  onComplete?: () => void;
}

interface CompanyAnalysis {
  name: string;
  industry: string;
  description: string;
  website: string;
  size: string;
  location: string;
  founded: string;
  services: string[];
  targetAudience: string;
  competitors: Array<{
    name: string;
    website: string;
    strengths: string[];
  }>;
  marketInsights: {
    marketSize: string;
    growthRate: string;
    trends: string[];
    opportunities: string[];
    challenges: string[];
    predictions: string[];
  };
  digitalPresence: {
    socialMedia: string[];
    seoKeywords: string[];
    contentStrategy: string[];
    digitalChannels: string[];
  };
}

export const EnhancedSmartOnboarding = ({ user, onComplete }: SmartOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [companyAnalysis, setCompanyAnalysis] = useState<CompanyAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const analyzeWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast.error('يرجى إدخال رابط الموقع');
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    try {
      console.log('🔍 بدء تحليل الموقع:', websiteUrl);

      const { data, error } = await supabase.functions.invoke('analyze-website-perplexity', {
        body: { website: websiteUrl.trim() }
      });

      if (error) {
        throw new Error(error.message || 'حدث خطأ في التحليل');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'فشل في تحليل الموقع');
      }

      const analysisData = data.data;
      
      // تنظيم البيانات
      const analysis: CompanyAnalysis = {
        name: analysisData.name || 'شركة غير محددة',
        industry: analysisData.industry || '',
        description: analysisData.description || '',
        website: websiteUrl,
        size: analysisData.size || '',
        location: analysisData.location || '',
        founded: analysisData.founded || '',
        services: Array.isArray(analysisData.services) ? analysisData.services : [],
        targetAudience: analysisData.targetAudience || '',
        competitors: Array.isArray(analysisData.competitors) ? analysisData.competitors : [],
        marketInsights: {
          marketSize: analysisData.marketInsights?.marketSize || '',
          growthRate: analysisData.marketInsights?.growthRate || '',
          trends: Array.isArray(analysisData.marketInsights?.trends) ? analysisData.marketInsights.trends : [],
          opportunities: Array.isArray(analysisData.marketInsights?.opportunities) ? analysisData.marketInsights.opportunities : [],
          challenges: Array.isArray(analysisData.marketInsights?.challenges) ? analysisData.marketInsights.challenges : [],
          predictions: Array.isArray(analysisData.marketInsights?.predictions) ? analysisData.marketInsights.predictions : []
        },
        digitalPresence: {
          socialMedia: Array.isArray(analysisData.digitalPresence?.socialMedia) ? analysisData.digitalPresence.socialMedia : [],
          seoKeywords: Array.isArray(analysisData.digitalPresence?.seoKeywords) ? analysisData.digitalPresence.seoKeywords : [],
          contentStrategy: Array.isArray(analysisData.digitalPresence?.contentStrategy) ? analysisData.digitalPresence.contentStrategy : [],
          digitalChannels: Array.isArray(analysisData.digitalPresence?.digitalChannels) ? analysisData.digitalPresence.digitalChannels : []
        }
      };

      setCompanyAnalysis(analysis);
      toast.success('تم تحليل الموقع بنجاح! 🎉');
      setCurrentStep(2);

    } catch (error: any) {
      console.error('خطأ في التحليل:', error);
      setAnalysisError(error.message);
      toast.error('حدث خطأ في التحليل. يمكنك المحاولة مرة أخرى أو المتابعة يدوياً');
    } finally {
      setAnalyzing(false);
    }
  };

  const saveCompanyData = async () => {
    if (!companyAnalysis) return;

    setLoading(true);
    try {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: companyAnalysis.name,
          industry: companyAnalysis.industry,
          description: companyAnalysis.description,
          website: companyAnalysis.website,
          size: companyAnalysis.size,
          location: companyAnalysis.location,
          founded: companyAnalysis.founded,
          user_id: user.id
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // حفظ التحليل
      const { error: analysisError } = await supabase
        .from('company_analysis')
        .insert({
          company_id: company.id,
          market_insights: companyAnalysis.marketInsights,
          recommendations: {
            services: companyAnalysis.services,
            targetAudience: companyAnalysis.targetAudience,
            digitalPresence: companyAnalysis.digitalPresence
          },
          competitors: companyAnalysis.competitors.map(c => c.name)
        });

      if (analysisError) throw analysisError;

      toast.success('تم حفظ بيانات الشركة بنجاح!');
      setCurrentStep(3);
    } catch (error: any) {
      console.error('Error saving company data:', error);
      toast.error('حدث خطأ في حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">تحليل ذكي لشركتك 🚀</h2>
              <p className="text-gray-600">فقط أدخل رابط موقعك وسنحلل كل شيء تلقائياً باستخدام Perplexity AI!</p>
            </div>
            
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-3">ما سنحصل عليه من التحليل:</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    معلومات شركتك الأساسية تلقائياً
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    تحليل شامل للمنافسين في السوق
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    رؤى السوق والفرص المتاحة
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-600 ml-2" />
                    توصيات تسويقية مخصصة لشركتك
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div>
                <Label htmlFor="website">رابط موقع شركتك *</Label>
                <Input
                  id="website"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                  required
                />
              </div>
              
              {analysisError && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{analysisError}</span>
                    </div>
                    <p className="text-xs text-amber-600 mt-1">
                      يمكنك المحاولة مرة أخرى أو المتابعة لإدخال البيانات يدوياً
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex gap-3">
                <Button 
                  onClick={analyzeWebsite}
                  disabled={!websiteUrl.trim() || analyzing}
                  className="flex-1"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      جاري التحليل الذكي...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 ml-2" />
                      ابدأ التحليل الذكي
                    </>
                  )}
                </Button>
                
                {analysisError && (
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    size="lg"
                  >
                    متابعة يدوياً
                  </Button>
                )}
              </div>
            </div>

            {analyzing && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>تحليل محتوى الموقع...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>البحث عن المنافسين...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>تحليل السوق والصناعة...</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                      <span>إنشاء التوصيات المخصصة...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">مراجعة وتأكيد البيانات</h2>
              <p className="text-gray-600">تحقق من المعلومات وعدّل ما تريد</p>
            </div>

            {companyAnalysis && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>معلومات الشركة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>اسم الشركة</Label>
                      <Input 
                        value={companyAnalysis.name}
                        onChange={(e) => setCompanyAnalysis(prev => prev ? {...prev, name: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label>الصناعة</Label>
                      <Input 
                        value={companyAnalysis.industry}
                        onChange={(e) => setCompanyAnalysis(prev => prev ? {...prev, industry: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label>وصف الشركة</Label>
                      <Textarea 
                        value={companyAnalysis.description}
                        onChange={(e) => setCompanyAnalysis(prev => prev ? {...prev, description: e.target.value} : null)}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>الموقع</Label>
                        <Input 
                          value={companyAnalysis.location}
                          onChange={(e) => setCompanyAnalysis(prev => prev ? {...prev, location: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label>سنة التأسيس</Label>
                        <Input 
                          value={companyAnalysis.founded}
                          onChange={(e) => setCompanyAnalysis(prev => prev ? {...prev, founded: e.target.value} : null)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {companyAnalysis.competitors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>المنافسون</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {companyAnalysis.competitors.map((competitor, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold">{competitor.name}</h4>
                            {competitor.website && (
                              <p className="text-sm text-blue-600">{competitor.website}</p>
                            )}
                            {competitor.strengths.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {competitor.strengths.map((strength, i) => (
                                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {strength}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>رؤى السوق</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {companyAnalysis.marketInsights.marketSize && (
                        <p><strong>حجم السوق:</strong> {companyAnalysis.marketInsights.marketSize}</p>
                      )}
                      {companyAnalysis.marketInsights.growthRate && (
                        <p><strong>معدل النمو:</strong> {companyAnalysis.marketInsights.growthRate}</p>
                      )}
                      {companyAnalysis.marketInsights.trends.length > 0 && (
                        <div>
                          <strong>الاتجاهات:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {companyAnalysis.marketInsights.trends.map((trend, index) => (
                              <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                {trend}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                السابق
              </Button>
              <Button onClick={saveCompanyData} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  'تأكيد وحفظ'
                )}
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <SocialConnectStep onNext={handleNext} onBack={handleBack} />
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">مراجعة الإعدادات والأمان</h2>
              <p className="text-gray-600">تأكد من جميع الإعدادات قبل البدء</p>
            </div>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-green-900 mb-4">✅ تم إكمال الإعداد بنجاح!</h3>
                <div className="space-y-3 text-green-800">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    <span>تم تحليل شركتك وحفظ البيانات</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    <span>تم ربط حسابات التواصل الاجتماعي</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    <span>تم إنشاء التوصيات المخصصة</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    <span>جاهز لبدء التسويق الذكي</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-4">🔒 ضمانات الخصوصية والأمان</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• جميع بياناتك محمية بأعلى معايير الأمان</li>
                  <li>• لن نشارك معلوماتك مع أي طرف ثالث</li>
                  <li>• يمكنك إلغاء ربط حساباتك في أي وقت</li>
                  <li>• جميع عمليات النشر تتم بعد موافقتك</li>
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                السابق
              </Button>
              <Button onClick={handleNext} size="lg">
                الانتقال للوحة التحكم
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">مرحباً بك في Morvo! 🎉</h2>
              <p className="text-gray-600">كل شيء جاهز، ابدأ رحلتك التسويقية الذكية الآن</p>
            </div>

            <Card className="border-2 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 ما يمكنك فعله الآن:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center text-blue-800">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      <span>إنشاء حملات تسويقية ذكية</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      <span>النشر التلقائي على جميع المنصات</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-blue-800">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      <span>تحليل الأداء والإحصائيات</span>
                    </div>
                    <div className="flex items-center text-blue-800">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      <span>الحصول على توصيات مخصصة</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleComplete} size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Rocket className="w-5 h-5 ml-2" />
              ابدأ التسويق الذكي الآن!
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="mb-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">الخطوة {currentStep} من {totalSteps}</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};
