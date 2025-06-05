import { environment, AgentId, AgentType } from '@/config/environment';

// Enhanced API client with M1-M5 agent support
class MorvoAPIClient {
  private baseURL: string;
  private wsURL: string;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private retryAttempts: number;
  private timeout: number;

  constructor() {
    this.baseURL = environment.morvoApiUrl;
    this.wsURL = environment.morvoWebSocketUrl;
    
    this.cache = new Map();
    this.retryAttempts = 3;
    this.timeout = 30000;

    console.log('🚀 Morvo API Client initialized');
    console.log('🌐 API URL:', this.baseURL);
    console.log('🔌 WebSocket URL:', this.wsURL);
  }

  // Cache management
  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  // Enhanced request with retry and caching
  async request(endpoint: string, options: RequestInit = {}, useCache: boolean = true, cacheTTL: number = 300000): Promise<any> {
    const cacheKey = this.getCacheKey(endpoint, options.body);
    
    // Check cache for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        [environment.apiKeyHeader]: environment.apiKey,
      },
      ...options,
    };

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful GET requests
        if (useCache && (!options.method || options.method === 'GET')) {
          this.setCache(cacheKey, data, cacheTTL);
        }

        return data;

      } catch (error: any) {
        console.warn(`🔄 Attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.retryAttempts) {
          throw new Error(`Failed after ${this.retryAttempts} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  // Basic API methods
  async health() {
    return this.request('/health');
  }

  async sendMessage(message: string, userId: string = 'user_123', agentId?: AgentId) {
    return this.request('/api/v2/chat/message', {
      method: 'POST',
      body: JSON.stringify({ 
        message, 
        user_id: userId,
        agent_id: agentId,
        language: environment.defaultLanguage 
      })
    }, false);
  }

  // Platform management methods
  async getAvailablePlatforms() {
    return this.request('/api/v2/platforms/available');
  }

  async connectPlatform(platform: string, credentials: any) {
    return this.request('/api/v2/platforms/connect', {
      method: 'POST',
      body: JSON.stringify({
        platform,
        credentials
      })
    }, false);
  }

  async analyzeWebsite(url: string) {
    return this.request('/api/v2/analysis/website', {
      method: 'POST',
      body: JSON.stringify({ url })
    }, false);
  }

  // M1 - Strategic Marketing Agent
  async getStrategicAnalysis(companyData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m1/strategic-analysis', {
      method: 'POST',
      body: JSON.stringify({ 
        company_data: companyData,
        user_id: userId,
        analysis_type: 'comprehensive'
      })
    }, true, 600000); // Cache for 10 minutes
  }

  async generateMarketingStrategy(goals: any, companyData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m1/marketing-strategy', {
      method: 'POST',
      body: JSON.stringify({
        goals,
        company_data: companyData,
        user_id: userId,
        include_timeline: true,
        include_budget: true
      })
    }, false);
  }

  async performCompetitorAnalysis(competitors: string[], industry: string, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m1/competitor-analysis', {
      method: 'POST',
      body: JSON.stringify({
        competitors,
        industry,
        user_id: userId,
        analysis_depth: 'detailed'
      })
    }, true, 1800000); // Cache for 30 minutes
  }

  async generateMarketInsights(marketData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m1/market-insights', {
      method: 'POST',
      body: JSON.stringify({
        market_data: marketData,
        user_id: userId,
        insight_types: ['trends', 'opportunities', 'threats']
      })
    }, true, 900000); // Cache for 15 minutes
  }

  // M2 - Social Media Agent
  async analyzeSocialPerformance(platforms: string[], accountData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m2/social-analysis', {
      method: 'POST',
      body: JSON.stringify({
        platforms,
        account_data: accountData,
        user_id: userId,
        metrics: ['engagement', 'reach', 'growth', 'sentiment']
      })
    }, true, 300000); // Cache for 5 minutes
  }

  async generateSocialContent(platform: string, topic: string, brand: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m2/content-generation', {
      method: 'POST',
      body: JSON.stringify({
        platform,
        topic,
        brand_info: brand,
        user_id: userId,
        language: environment.defaultLanguage,
        include_hashtags: true,
        include_visuals: true
      })
    }, false);
  }

  async optimizeSocialSchedule(contentCalendar: any, audienceData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m2/schedule-optimization', {
      method: 'POST',
      body: JSON.stringify({
        content_calendar: contentCalendar,
        audience_data: audienceData,
        user_id: userId,
        optimization_goal: 'engagement'
      })
    }, true, 600000);
  }

  async monitorSocialMentions(brand: string, keywords: string[], userId: string = 'user_123') {
    return this.request('/api/v2/agents/m2/mention-monitoring', {
      method: 'POST',
      body: JSON.stringify({
        brand,
        keywords,
        user_id: userId,
        sentiment_analysis: true,
        alert_threshold: 'medium'
      })
    }, false);
  }

  // M3 - Campaign Optimization Agent
  async optimizeCampaign(campaignId: string, performanceData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m3/campaign-optimization', {
      method: 'POST',
      body: JSON.stringify({
        campaign_id: campaignId,
        performance_data: performanceData,
        user_id: userId,
        optimization_goals: ['ctr', 'conversion_rate', 'roas']
      })
    }, false);
  }

  async runABTest(variants: any[], testConfig: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m3/ab-testing', {
      method: 'POST',
      body: JSON.stringify({
        variants,
        test_config: testConfig,
        user_id: userId,
        statistical_significance: 0.95
      })
    }, false);
  }

  async optimizeBudgetAllocation(campaigns: any[], totalBudget: number, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m3/budget-optimization', {
      method: 'POST',
      body: JSON.stringify({
        campaigns,
        total_budget: totalBudget,
        user_id: userId,
        optimization_period: '30_days'
      })
    }, true, 3600000); // Cache for 1 hour
  }

  async generateCampaignInsights(campaignData: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m3/campaign-insights', {
      method: 'POST',
      body: JSON.stringify({
        campaign_data: campaignData,
        user_id: userId,
        insight_types: ['performance', 'optimization', 'predictions']
      })
    }, true, 900000);
  }

  // M4 - Content Creation Agent
  async generateContent(contentType: string, brief: any, brand: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m4/content-creation', {
      method: 'POST',
      body: JSON.stringify({
        content_type: contentType,
        brief,
        brand_guidelines: brand,
        user_id: userId,
        language: environment.defaultLanguage,
        tone_of_voice: brand.tone || 'professional'
      })
    }, false);
  }

  async optimizeContent(content: string, target: any, platform: string, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m4/content-optimization', {
      method: 'POST',
      body: JSON.stringify({
        content,
        target_audience: target,
        platform,
        user_id: userId,
        optimization_goals: ['engagement', 'readability', 'seo']
      })
    }, false);
  }

  async generateContentCalendar(theme: string, duration: number, brand: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m4/content-calendar', {
      method: 'POST',
      body: JSON.stringify({
        theme,
        duration_days: duration,
        brand_info: brand,
        user_id: userId,
        platforms: ['instagram', 'facebook', 'twitter', 'linkedin'],
        content_mix: ['posts', 'stories', 'videos', 'articles']
      })
    }, true, 1800000);
  }

  async analyzeContentPerformance(contentData: any[], userId: string = 'user_123') {
    return this.request('/api/v2/agents/m4/content-analysis', {
      method: 'POST',
      body: JSON.stringify({
        content_data: contentData,
        user_id: userId,
        metrics: ['engagement', 'reach', 'shares', 'comments', 'conversions']
      })
    }, true, 600000);
  }

  // M5 - Data Analytics Agent
  async analyzePerformanceData(data: any, metrics: string[], userId: string = 'user_123') {
    return this.request('/api/v2/agents/m5/performance-analysis', {
      method: 'POST',
      body: JSON.stringify({
        data,
        metrics,
        user_id: userId,
        analysis_period: 'last_30_days',
        include_forecasting: true
      })
    }, true, 300000);
  }

  async generateInsights(metricsData: any, context: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m5/insights-generation', {
      method: 'POST',
      body: JSON.stringify({
        metrics_data: metricsData,
        business_context: context,
        user_id: userId,
        insight_types: ['trends', 'anomalies', 'opportunities', 'recommendations']
      })
    }, true, 600000);
  }

  async createPredictiveModel(historicalData: any, targetMetric: string, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m5/predictive-modeling', {
      method: 'POST',
      body: JSON.stringify({
        historical_data: historicalData,
        target_metric: targetMetric,
        user_id: userId,
        model_type: 'time_series',
        prediction_horizon: '90_days'
      })
    }, true, 3600000);
  }

  async generateAnalyticsReport(dataPoints: any[], reportType: string, userId: string = 'user_123') {
    return this.request('/api/v2/agents/m5/analytics-report', {
      method: 'POST',
      body: JSON.stringify({
        data_points: dataPoints,
        report_type: reportType,
        user_id: userId,
        include_visualizations: true,
        format: 'comprehensive'
      })
    }, true, 1800000);
  }

  // Cross-agent collaboration endpoints
  async initiateAgentCollaboration(initiatorAgent: AgentId, targetAgents: AgentId[], task: any, userId: string = 'user_123') {
    return this.request('/api/v2/agents/collaboration/initiate', {
      method: 'POST',
      body: JSON.stringify({
        initiator: initiatorAgent,
        participants: targetAgents,
        task,
        user_id: userId,
        collaboration_type: 'multi_agent'
      })
    }, false);
  }

  async getAgentInsights(agentId: AgentId, userId: string = 'user_123') {
    return this.request(`/api/v2/agents/${agentId.toLowerCase()}/insights`, {
      method: 'GET'
    }, true, 600000);
  }

  // WebSocket connection with agent-specific channels
  connectWebSocket(
    onMessage: (data: any) => void,
    onError?: (error: Event) => void,
    onClose?: () => void,
    agentId?: AgentId
  ): WebSocket {
    const wsUrl = agentId 
      ? `${this.wsURL}/agents/${agentId.toLowerCase()}`
      : `${this.wsURL}/chat`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`✅ WebSocket connected to ${agentId ? `Agent ${agentId}` : 'General Chat'}`);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error(`WebSocket error for ${agentId || 'General'}:`, error);
      onError?.(error);
    };
    
    ws.onclose = () => {
      console.log(`❌ WebSocket disconnected from ${agentId || 'General'}`);
      onClose?.();
    };
    
    return ws;
  }

  sendWebSocketMessage(ws: WebSocket, message: string, userId: string = 'user_123', agentId?: AgentId) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'chat_message',
        message,
        user_id: userId,
        agent_id: agentId,
        timestamp: new Date().toISOString(),
        language: environment.defaultLanguage
      }));
    }
  }

  // Enhanced connection testing for all agents
  async testConnection() {
    const results = {
      api: false,
      websocket: false,
      agents: {
        M1: false,
        M2: false,
        M3: false,
        M4: false,
        M5: false
      },
      overall: false
    };

    try {
      // Test API
      const health = await this.health();
      results.api = health.status === 'healthy';

      // Test each agent endpoint
      for (const agentId of ['M1', 'M2', 'M3', 'M4', 'M5'] as AgentId[]) {
        try {
          const insights = await this.getAgentInsights(agentId);
          results.agents[agentId] = !!insights;
        } catch (error) {
          console.warn(`Agent ${agentId} test failed:`, error);
          results.agents[agentId] = false;
        }
      }

      // Test WebSocket
      const wsTest = new Promise<boolean>((resolve) => {
        const ws = this.connectWebSocket(
          () => {
            ws.close();
            resolve(true);
          },
          () => resolve(false),
          () => resolve(false)
        );

        setTimeout(() => {
          ws.close();
          resolve(false);
        }, 5000);
      });

      results.websocket = await wsTest;
      results.overall = results.api && Object.values(results.agents).some(Boolean);

      return results;
    } catch (error) {
      console.error('Connection test failed:', error);
      return results;
    }
  }
}

const morvoAPI = new MorvoAPIClient();
export default morvoAPI;
