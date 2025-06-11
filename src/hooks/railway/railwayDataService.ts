
import { supabase } from '@/integrations/supabase/client';
import { CompanyData } from '../useRailwayIntegration';

export const saveAgentResults = async (
  agentType: string,
  companyData: CompanyData,
  result: any,
  estimatedTime: number
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (company?.id) {
      // Save to main agent_results table with better error handling
      const { error: agentError } = await supabase
        .from('agent_results')
        .insert({
          agent_id: agentType,
          task_type: agentType.startsWith('M') ? 'agent_execution' : 'crew_execution',
          input_data: companyData as any,
          output_data: result as any,
          status: 'completed',
          execution_time_ms: estimatedTime,
          user_id: user.id,
          company_id: company.id,
          chart_configs: result.chart_configs || {}
        });

      if (agentError) {
        console.error('Error saving to agent_results:', agentError);
        return;
      }

      // Save to specific tables based on agent type
      await saveToSpecificTables(agentType, result, user.id, company.id);
    }
  } catch (error) {
    console.error('Error saving enhanced results:', error);
  }
};

const saveToSpecificTables = async (
  agentType: string,
  result: any,
  userId: string,
  companyId: string
) => {
  switch (agentType) {
    case 'M1_STRATEGIC':
      await supabase
        .from('strategic_analyses')
        .insert({
          user_id: userId,
          company_id: companyId,
          swot_analysis: result.swot_analysis || {},
          competitor_data: result.competitor_analysis || {},
          market_trends: result.market_trends || {},
          positioning_map: result.positioning || {},
          kpi_metrics: result.kpis || {}
        });
      break;

    case 'M2_SOCIAL':
      await supabase
        .from('social_monitoring')
        .insert({
          user_id: userId,
          company_id: companyId,
          sentiment_analysis: result.sentiment_analysis || {},
          engagement_metrics: result.engagement_metrics || {},
          audience_insights: result.audience_insights || {},
          platform_comparison: result.platform_comparison || {},
          follower_growth: result.follower_growth || {}
        });
      break;

    case 'M3_CAMPAIGN':
      if (result.campaigns) {
        for (const campaign of result.campaigns) {
          await supabase
            .from('marketing_campaigns')
            .insert({
              user_id: userId,
              name: campaign.name || 'حملة جديدة',
              description: campaign.description,
              performance_data: campaign.performance || {},
              conversion_funnel: campaign.funnel || {},
              budget_allocation: campaign.budget || {},
              attribution_data: campaign.attribution || {},
              ab_testing_results: campaign.ab_testing || {}
            });
        }
      }
      break;

    case 'M4_CONTENT':
      if (result.content_items) {
        for (const content of result.content_items) {
          await supabase
            .from('content_calendar')
            .insert({
              user_id: userId,
              title: content.title || 'محتوى جديد',
              content_text: content.text,
              content_type: content.type,
              platform: content.platform,
              seo_performance: content.seo || {},
              topic_clusters: content.topics || {},
              distribution_metrics: content.distribution || {},
              status: 'draft'
            });
        }
      }
      break;

    case 'M5_ANALYTICS':
      await supabase
        .from('bi_reports')
        .insert({
          user_id: userId,
          report_name: `تقرير تحليلي - ${new Date().toLocaleDateString('ar-SA')}`,
          report_type: 'comprehensive',
          report_data: result.report_data || {},
          predictive_models: result.predictive_models || {},
          customer_segments: result.customer_segments || {},
          cohort_analysis: result.cohort_analysis || {},
          roi_calculator: result.roi_calculator || {},
          insights: result.insights || {},
          recommendations: result.recommendations || {}
        });
      break;
  }
};
