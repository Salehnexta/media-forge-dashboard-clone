
// Morvo AI - 9 Specialized Marketing Agents Data

export const MORVO_AGENTS = {
  // Master Agent
  client_experience: {
    id: 'client_experience',
    name: 'وكيل تجربة العملاء',
    nameEn: 'Client Experience Agent',
    description: 'يدير تجربة العميل الشاملة وينسق بين جميع الوكلاء الآخرين',
    type: 'master',
    capabilities: [
      'إدارة المحادثات',
      'تنسيق الوكلاء',
      'تحليل الاحتياجات',
      'تقديم التوصيات الشاملة'
    ],
    color: 'from-purple-600 to-purple-700',
    icon: '👑',
    priority: 1
  },
  
  // Specialist Agents
  seo_agent: {
    id: 'seo_agent',
    name: 'وكيل تحسين محركات البحث',
    nameEn: 'SEO Agent',
    description: 'متخصص في تحسين الظهور في محركات البحث وتحليل الكلمات المفتاحية',
    type: 'specialist',
    capabilities: [
      'تحليل الكلمات المفتاحية',
      'تحسين المحتوى للSEO',
      'مراقبة الترتيب',
      'تحليل المنافسين'
    ],
    color: 'from-green-600 to-green-700',
    icon: '🔍',
    priority: 2
  },
  
  content_management: {
    id: 'content_management',
    name: 'وكيل إدارة المحتوى',
    nameEn: 'Content Management Agent',
    description: 'يدير استراتيجية المحتوى وينشئ محتوى عالي الجودة',
    type: 'specialist',
    capabilities: [
      'إنشاء المحتوى',
      'تخطيط التقويم التحريري',
      'تحليل أداء المحتوى',
      'تحسين المشاركة'
    ],
    color: 'from-blue-600 to-blue-700',
    icon: '📝',
    priority: 3
  },
  
  social_media: {
    id: 'social_media',
    name: 'وكيل وسائل التواصل الاجتماعي',
    nameEn: 'Social Media Agent',
    description: 'متخصص في إدارة منصات التواصل الاجتماعي وزيادة التفاعل',
    type: 'specialist',
    capabilities: [
      'إدارة المنصات الاجتماعية',
      'تحليل التفاعل',
      'إنشاء حملات اجتماعية',
      'مراقبة الاتجاهات'
    ],
    color: 'from-pink-600 to-pink-700',
    icon: '📱',
    priority: 4
  },
  
  paid_ads: {
    id: 'paid_ads',
    name: 'وكيل الإعلانات المدفوعة',
    nameEn: 'Paid Ads Agent',
    description: 'متخصص في إدارة وتحسين الحملات الإعلانية المدفوعة',
    type: 'specialist',
    capabilities: [
      'إدارة حملات PPC',
      'تحسين الإعلانات',
      'تحليل ROI',
      'إدارة الميزانيات'
    ],
    color: 'from-orange-600 to-orange-700',
    icon: '💰',
    priority: 5
  },
  
  email_marketing: {
    id: 'email_marketing',
    name: 'وكيل التسويق عبر البريد الإلكتروني',
    nameEn: 'Email Marketing Agent',
    description: 'متخصص في حملات البريد الإلكتروني والأتمتة التسويقية',
    type: 'specialist',
    capabilities: [
      'تصميم حملات البريد',
      'أتمتة التسويق',
      'تحليل معدلات الفتح',
      'تقسيم القوائم'
    ],
    color: 'from-indigo-600 to-indigo-700',
    icon: '📧',
    priority: 6
  },
  
  analytics_agent: {
    id: 'analytics_agent',
    name: 'وكيل التحليلات',
    nameEn: 'Analytics Agent',
    description: 'متخصص في تحليل البيانات وتقديم الرؤى التسويقية',
    type: 'specialist',
    capabilities: [
      'تحليل البيانات',
      'إنشاء التقارير',
      'تتبع التحويلات',
      'تحليل السلوك'
    ],
    color: 'from-cyan-600 to-cyan-700',
    icon: '📊',
    priority: 7
  },
  
  brand_monitoring: {
    id: 'brand_monitoring',
    name: 'وكيل مراقبة العلامة التجارية',
    nameEn: 'Brand Monitoring Agent',
    description: 'يراقب سمعة العلامة التجارية ويدير الأزمات',
    type: 'specialist',
    capabilities: [
      'مراقبة الذكر',
      'تحليل المشاعر',
      'إدارة السمعة',
      'تنبيهات الأزمات'
    ],
    color: 'from-red-600 to-red-700',
    icon: '🛡️',
    priority: 8
  },
  
  competitor_analysis: {
    id: 'competitor_analysis',
    name: 'وكيل تحليل المنافسين',
    nameEn: 'Competitor Analysis Agent',
    description: 'يحلل المنافسين ويقدم رؤى تنافسية استراتيجية',
    type: 'specialist',
    capabilities: [
      'تحليل المنافسين',
      'مراقبة الأسعار',
      'تحليل SWOT',
      'تحديد الفرص'
    ],
    color: 'from-gray-600 to-gray-700',
    icon: '🎯',
    priority: 9
  }
};

// Export aiManagers for backward compatibility
export const aiManagers = Object.values(MORVO_AGENTS);

// Dashboard contexts for each agent
export const DASHBOARD_CONTEXTS = {
  seo: {
    charts: ['keyword_rankings', 'organic_traffic', 'serp_positions', 'backlink_analysis'],
    metrics: ['organic_traffic', 'keyword_count', 'page_speed', 'domain_authority']
  },
  content: {
    charts: ['content_performance', 'engagement_trends', 'content_calendar', 'topic_analysis'],
    metrics: ['content_pieces', 'avg_engagement', 'content_roi', 'publishing_frequency']
  },
  social_media: {
    charts: ['engagement_by_platform', 'follower_growth', 'post_performance', 'hashtag_analysis'],
    metrics: ['total_followers', 'engagement_rate', 'reach', 'impressions']
  },
  paid_ads: {
    charts: ['campaign_performance', 'cost_analysis', 'conversion_funnel', 'ab_test_results'],
    metrics: ['ad_spend', 'cpa', 'roas', 'click_through_rate']
  },
  email_marketing: {
    charts: ['open_rates', 'click_rates', 'list_growth', 'automation_performance'],
    metrics: ['list_size', 'open_rate', 'click_rate', 'unsubscribe_rate']
  },
  analytics: {
    charts: ['traffic_overview', 'user_behavior', 'conversion_trends', 'revenue_attribution'],
    metrics: ['sessions', 'conversion_rate', 'bounce_rate', 'avg_session_duration']
  },
  brand_monitoring: {
    charts: ['sentiment_analysis', 'mention_volume', 'share_of_voice', 'crisis_alerts'],
    metrics: ['sentiment_score', 'mention_count', 'brand_awareness', 'reputation_score']
  },
  competitor_analysis: {
    charts: ['market_share', 'competitive_positioning', 'feature_comparison', 'pricing_analysis'],
    metrics: ['market_position', 'competitive_score', 'feature_gap', 'price_advantage']
  }
};

// Sample metrics for development
export const SAMPLE_METRICS = {
  strategic: {
    totalCampaigns: 12,
    activeProjects: 8,
    monthlyRevenue: '€25,400',
    growthRate: '+15.8%'
  },
  seo: {
    organicTraffic: 145200,
    keywordRankings: 342,
    pageSpeed: 92,
    domainAuthority: 67
  },
  content: {
    contentPieces: 48,
    avgEngagement: '4.2%',
    contentROI: '3.8x',
    publishingFreq: 12
  },
  social_media: {
    totalFollowers: 28400,
    engagementRate: '6.8%',
    reach: 124000,
    impressions: 890000
  },
  paid_ads: {
    adSpend: '€8,200',
    cpa: '€12.40',
    roas: '4.2x',
    ctr: '2.8%'
  }
};

// Mock chart data for development
export const mockChartData = {
  strategic: {
    roi: [
      { month: 'يناير', actual: 85, expected: 80 },
      { month: 'فبراير', actual: 92, expected: 85 },
      { month: 'مارس', actual: 88, expected: 90 },
      { month: 'أبريل', actual: 95, expected: 92 },
      { month: 'مايو', actual: 98, expected: 95 },
      { month: 'يونيو', actual: 102, expected: 98 }
    ],
    budget: [
      { name: 'الإعلانات المدفوعة', value: 35, color: '#3b82f6' },
      { name: 'وسائل التواصل', value: 25, color: '#10b981' },
      { name: 'تحسين المحتوى', value: 20, color: '#f59e0b' },
      { name: 'التحليلات', value: 20, color: '#ef4444' }
    ]
  }
};

// Agent response templates
export const AGENT_RESPONSES = {
  welcome: {
    ar: 'مرحباً! أنا {agentName}، كيف يمكنني مساعدتك اليوم؟',
    en: 'Hello! I\'m {agentName}, how can I help you today?'
  },
  analysis_complete: {
    ar: 'تم تحليل البيانات بنجاح. إليك النتائج:',
    en: 'Data analysis completed successfully. Here are the results:'
  },
  recommendations: {
    ar: 'بناءً على التحليل، إليك توصياتي:',
    en: 'Based on the analysis, here are my recommendations:'
  }
};
