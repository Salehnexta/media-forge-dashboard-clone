
-- External API Data Tables
-- SEMrush data storage
CREATE TABLE semrush_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    organic_keywords JSONB DEFAULT '[]',
    organic_traffic INTEGER DEFAULT 0,
    keyword_rankings JSONB DEFAULT '{}',
    competitor_data JSONB DEFAULT '{}',
    backlink_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand24 monitoring data
CREATE TABLE brand24_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    mentions JSONB DEFAULT '[]',
    sentiment_analysis JSONB DEFAULT '{}',
    influencers JSONB DEFAULT '[]',
    competitor_mentions JSONB DEFAULT '{}',
    crisis_alerts JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social media analytics
CREATE TABLE social_media_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    metrics JSONB NOT NULL DEFAULT '{}',
    engagement_data JSONB DEFAULT '{}',
    audience_insights JSONB DEFAULT '{}',
    content_performance JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- External API configurations
CREATE TABLE external_api_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    api_name TEXT NOT NULL,
    api_key_encrypted TEXT,
    config_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Integrated analytics insights
CREATE TABLE integrated_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    analysis_type TEXT NOT NULL,
    insights JSONB NOT NULL DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',
    confidence_score FLOAT DEFAULT 0.0,
    data_sources JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Model Usage Tracking
-- AI model usage and costs
CREATE TABLE ai_model_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID,
    model_name TEXT NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    cost DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name TEXT NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    status_code INTEGER,
    success BOOLEAN NOT NULL,
    request_size INTEGER,
    response_size INTEGER,
    latency_ms INTEGER,
    cost DECIMAL(10,4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Configuration Tables
-- System prompts for AI agents
CREATE TABLE system_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT NOT NULL,
    prompt_type TEXT NOT NULL,
    prompt_content TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User contexts for personalization
CREATE TABLE user_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    context_type TEXT NOT NULL,
    context_data JSONB NOT NULL DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create All Indexes for Performance
CREATE INDEX idx_semrush_data_user_id ON semrush_data(user_id);
CREATE INDEX idx_semrush_data_domain ON semrush_data(domain);
CREATE INDEX idx_brand24_data_user_id ON brand24_data(user_id);
CREATE INDEX idx_brand24_data_brand_name ON brand24_data(brand_name);
CREATE INDEX idx_social_media_analytics_user_id ON social_media_analytics(user_id);
CREATE INDEX idx_social_media_analytics_platform ON social_media_analytics(platform);
CREATE INDEX idx_external_api_configs_user_id ON external_api_configs(user_id);
CREATE INDEX idx_external_api_configs_api_name ON external_api_configs(api_name);
CREATE INDEX idx_integrated_analytics_user_id ON integrated_analytics(user_id);
CREATE INDEX idx_integrated_analytics_type ON integrated_analytics(analysis_type);
CREATE INDEX idx_ai_model_usage_client_id ON ai_model_usage(client_id);
CREATE INDEX idx_ai_model_usage_model_name ON ai_model_usage(model_name);
CREATE INDEX idx_api_usage_client_id ON api_usage(client_id);
CREATE INDEX idx_api_usage_service_name ON api_usage(service_name);
CREATE INDEX idx_system_prompts_agent_id ON system_prompts(agent_id);
CREATE INDEX idx_user_contexts_user_id ON user_contexts(user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE semrush_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand24_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_api_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrated_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_contexts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can access their own semrush data" ON semrush_data FOR ALL USING (user_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can access their own brand24 data" ON brand24_data FOR ALL USING (user_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can access their own social media analytics" ON social_media_analytics FOR ALL USING (user_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can access their own external API configs" ON external_api_configs FOR ALL USING (user_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can access their own integrated analytics" ON integrated_analytics FOR ALL USING (user_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can access their own AI model usage" ON ai_model_usage FOR ALL USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "Users can access their own API usage" ON api_usage FOR ALL USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));
CREATE POLICY "All users can read system prompts" ON system_prompts FOR SELECT USING (true);
CREATE POLICY "Users can access their own contexts" ON user_contexts FOR ALL USING (user_id = auth.uid());

-- Create update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_semrush_data_updated_at BEFORE UPDATE ON semrush_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand24_data_updated_at BEFORE UPDATE ON brand24_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_media_analytics_updated_at BEFORE UPDATE ON social_media_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_external_api_configs_updated_at BEFORE UPDATE ON external_api_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_prompts_updated_at BEFORE UPDATE ON system_prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_contexts_updated_at BEFORE UPDATE ON user_contexts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
