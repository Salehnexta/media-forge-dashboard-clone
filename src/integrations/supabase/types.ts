export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      a2a_messages: {
        Row: {
          content: string | null
          from_agent: string | null
          id: string
          timestamp: string | null
          to_agent: string | null
        }
        Insert: {
          content?: string | null
          from_agent?: string | null
          id?: string
          timestamp?: string | null
          to_agent?: string | null
        }
        Update: {
          content?: string | null
          from_agent?: string | null
          id?: string
          timestamp?: string | null
          to_agent?: string | null
        }
        Relationships: []
      }
      a2a_realtime_updates: {
        Row: {
          created_at: string
          data: Json
          id: string
          type: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: string
          type: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          type?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          agent_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          morvo_response_content: string | null
          session_id: string | null
          user_message_content: string | null
        }
        Insert: {
          agent_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          morvo_response_content?: string | null
          session_id?: string | null
          user_message_content?: string | null
        }
        Update: {
          agent_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          morvo_response_content?: string | null
          session_id?: string | null
          user_message_content?: string | null
        }
        Relationships: []
      }
      agent_definitions: {
        Row: {
          capabilities: Json
          created_at: string
          id: string
          name: string
          parameters: Json | null
          role: string
          updated_at: string
          version: string
        }
        Insert: {
          capabilities: Json
          created_at?: string
          id: string
          name: string
          parameters?: Json | null
          role: string
          updated_at?: string
          version: string
        }
        Update: {
          capabilities?: Json
          created_at?: string
          id?: string
          name?: string
          parameters?: Json | null
          role?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      agent_memories: {
        Row: {
          agent_type: string
          company_id: string | null
          content: Json
          created_at: string
          expires_at: string | null
          id: string
          memory_type: string
          relevance_score: number
          user_id: string
        }
        Insert: {
          agent_type: string
          company_id?: string | null
          content?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          memory_type: string
          relevance_score?: number
          user_id: string
        }
        Update: {
          agent_type?: string
          company_id?: string | null
          content?: Json
          created_at?: string
          expires_at?: string | null
          id?: string
          memory_type?: string
          relevance_score?: number
          user_id?: string
        }
        Relationships: []
      }
      agent_metrics: {
        Row: {
          agent_id: string
          error_count: number | null
          id: string
          memory_usage_mb: number | null
          metrics: Json | null
          response_time_ms: number | null
          success_rate: number | null
          timestamp: string
          tokens_used: number | null
        }
        Insert: {
          agent_id: string
          error_count?: number | null
          id?: string
          memory_usage_mb?: number | null
          metrics?: Json | null
          response_time_ms?: number | null
          success_rate?: number | null
          timestamp?: string
          tokens_used?: number | null
        }
        Update: {
          agent_id?: string
          error_count?: number | null
          id?: string
          memory_usage_mb?: number | null
          metrics?: Json | null
          response_time_ms?: number | null
          success_rate?: number | null
          timestamp?: string
          tokens_used?: number | null
        }
        Relationships: []
      }
      agent_results: {
        Row: {
          agent_id: string
          chart_configs: Json | null
          company_id: string | null
          cost_units: number | null
          created_at: string | null
          execution_time_ms: number | null
          id: string
          input_data: Json | null
          output_data: Json | null
          status: string | null
          task_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agent_id: string
          chart_configs?: Json | null
          company_id?: string | null
          cost_units?: number | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: string | null
          task_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string
          chart_configs?: Json | null
          company_id?: string | null
          cost_units?: number | null
          created_at?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          status?: string | null
          task_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      agent_workflows: {
        Row: {
          active_agents: Json
          completed_at: string | null
          complexity_score: number
          context: Json | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active_agents: Json
          completed_at?: string | null
          complexity_score?: number
          context?: Json | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          status: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active_agents?: Json
          completed_at?: string | null
          complexity_score?: number
          context?: Json | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_access: {
        Row: {
          access_scope: string | null
          account_id: string | null
          api_key: string | null
          company_id: string | null
          created_at: string | null
          encrypted: boolean | null
          id: string
          platform_name: string
          updated_at: string | null
        }
        Insert: {
          access_scope?: string | null
          account_id?: string | null
          api_key?: string | null
          company_id?: string | null
          created_at?: string | null
          encrypted?: boolean | null
          id?: string
          platform_name: string
          updated_at?: string | null
        }
        Update: {
          access_scope?: string | null
          account_id?: string | null
          api_key?: string | null
          company_id?: string | null
          created_at?: string | null
          encrypted?: boolean | null
          id?: string
          platform_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          event_type: string
          id: string
          properties: Json | null
          session_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          event_type: string
          id?: string
          properties?: Json | null
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          event_type?: string
          id?: string
          properties?: Json | null
          session_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      auto_discovery_data: {
        Row: {
          approval_status: string | null
          business_description: string | null
          company_id: string | null
          content_themes_suggested: string[] | null
          created_at: string | null
          discovered_competitors: string[] | null
          discovered_industry: string | null
          discovered_keywords: string[] | null
          id: string
          marketing_channels_suggested: string[] | null
          perplexity_analysis: Json | null
          social_media_found: Json | null
          target_audience_analysis: Json | null
          website_url: string | null
        }
        Insert: {
          approval_status?: string | null
          business_description?: string | null
          company_id?: string | null
          content_themes_suggested?: string[] | null
          created_at?: string | null
          discovered_competitors?: string[] | null
          discovered_industry?: string | null
          discovered_keywords?: string[] | null
          id?: string
          marketing_channels_suggested?: string[] | null
          perplexity_analysis?: Json | null
          social_media_found?: Json | null
          target_audience_analysis?: Json | null
          website_url?: string | null
        }
        Update: {
          approval_status?: string | null
          business_description?: string | null
          company_id?: string | null
          content_themes_suggested?: string[] | null
          created_at?: string | null
          discovered_competitors?: string[] | null
          discovered_industry?: string | null
          discovered_keywords?: string[] | null
          id?: string
          marketing_channels_suggested?: string[] | null
          perplexity_analysis?: Json | null
          social_media_found?: Json | null
          target_audience_analysis?: Json | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auto_discovery_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      bi_reports: {
        Row: {
          cohort_analysis: Json | null
          created_at: string | null
          customer_segments: Json | null
          data_sources: Json | null
          generated_at: string | null
          id: string
          insights: Json | null
          predictive_models: Json | null
          recommendations: Json | null
          report_data: Json
          report_name: string
          report_type: string | null
          roi_calculator: Json | null
          time_period_end: string | null
          time_period_start: string | null
          user_id: string | null
        }
        Insert: {
          cohort_analysis?: Json | null
          created_at?: string | null
          customer_segments?: Json | null
          data_sources?: Json | null
          generated_at?: string | null
          id?: string
          insights?: Json | null
          predictive_models?: Json | null
          recommendations?: Json | null
          report_data: Json
          report_name: string
          report_type?: string | null
          roi_calculator?: Json | null
          time_period_end?: string | null
          time_period_start?: string | null
          user_id?: string | null
        }
        Update: {
          cohort_analysis?: Json | null
          created_at?: string | null
          customer_segments?: Json | null
          data_sources?: Json | null
          generated_at?: string | null
          id?: string
          insights?: Json | null
          predictive_models?: Json | null
          recommendations?: Json | null
          report_data?: Json
          report_name?: string
          report_type?: string | null
          roi_calculator?: Json | null
          time_period_end?: string | null
          time_period_start?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      brand_positioning: {
        Row: {
          brand_voice: string | null
          company_id: string | null
          core_values: string[] | null
          created_at: string | null
          id: string
          mission_statement: string | null
          unique_selling_points: string[] | null
          updated_at: string | null
          vision_statement: string | null
        }
        Insert: {
          brand_voice?: string | null
          company_id?: string | null
          core_values?: string[] | null
          created_at?: string | null
          id?: string
          mission_statement?: string | null
          unique_selling_points?: string[] | null
          updated_at?: string | null
          vision_statement?: string | null
        }
        Update: {
          brand_voice?: string | null
          company_id?: string | null
          core_values?: string[] | null
          created_at?: string | null
          id?: string
          mission_statement?: string | null
          unique_selling_points?: string[] | null
          updated_at?: string | null
          vision_statement?: string | null
        }
        Relationships: []
      }
      brand24_data: {
        Row: {
          alert_settings: Json | null
          competitor_mentions: Json | null
          created_at: string | null
          crisis_alerts: Json | null
          id: string
          influencers: Json | null
          keywords: Json
          last_updated: string | null
          mentions: Json | null
          project_name: string
          reach_metrics: Json | null
          sentiment_analysis: Json | null
          share_of_voice: Json | null
          source_distribution: Json | null
          top_sources: Json | null
          trending_topics: Json | null
          user_id: string | null
        }
        Insert: {
          alert_settings?: Json | null
          competitor_mentions?: Json | null
          created_at?: string | null
          crisis_alerts?: Json | null
          id?: string
          influencers?: Json | null
          keywords: Json
          last_updated?: string | null
          mentions?: Json | null
          project_name: string
          reach_metrics?: Json | null
          sentiment_analysis?: Json | null
          share_of_voice?: Json | null
          source_distribution?: Json | null
          top_sources?: Json | null
          trending_topics?: Json | null
          user_id?: string | null
        }
        Update: {
          alert_settings?: Json | null
          competitor_mentions?: Json | null
          created_at?: string | null
          crisis_alerts?: Json | null
          id?: string
          influencers?: Json | null
          keywords?: Json
          last_updated?: string | null
          mentions?: Json | null
          project_name?: string
          reach_metrics?: Json | null
          sentiment_analysis?: Json | null
          share_of_voice?: Json | null
          source_distribution?: Json | null
          top_sources?: Json | null
          trending_topics?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      budget_info: {
        Row: {
          budget_allocation: Json | null
          budget_constraints: string | null
          budget_period: string | null
          company_id: string | null
          created_at: string
          expected_roi: number | null
          id: string
          monthly_marketing_budget: number | null
          priority_channels: Json | null
          total_marketing_budget: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget_allocation?: Json | null
          budget_constraints?: string | null
          budget_period?: string | null
          company_id?: string | null
          created_at?: string
          expected_roi?: number | null
          id?: string
          monthly_marketing_budget?: number | null
          priority_channels?: Json | null
          total_marketing_budget?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget_allocation?: Json | null
          budget_constraints?: string | null
          budget_period?: string | null
          company_id?: string | null
          created_at?: string
          expected_roi?: number | null
          id?: string
          monthly_marketing_budget?: number | null
          priority_channels?: Json | null
          total_marketing_budget?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_info_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      business_goals: {
        Row: {
          company_id: string | null
          conversion_targets: Json | null
          created_at: string | null
          id: string
          key_performance_indicators: string[] | null
          long_term_goals: Json | null
          revenue_targets: Json | null
          short_term_objectives: Json | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          conversion_targets?: Json | null
          created_at?: string | null
          id?: string
          key_performance_indicators?: string[] | null
          long_term_goals?: Json | null
          revenue_targets?: Json | null
          short_term_objectives?: Json | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          conversion_targets?: Json | null
          created_at?: string | null
          id?: string
          key_performance_indicators?: string[] | null
          long_term_goals?: Json | null
          revenue_targets?: Json | null
          short_term_objectives?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cache_items: {
        Row: {
          created_at: string
          expires_at: string | null
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      campaign_metrics: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          conversion_rate: number | null
          conversions: number | null
          cost: number | null
          created_at: string | null
          ctr: number | null
          id: string
          impressions: number | null
          metric_date: string
          quality_score: number | null
          revenue: number | null
          roas: number | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cost?: number | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          metric_date: string
          quality_score?: number | null
          revenue?: number | null
          roas?: number | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          conversion_rate?: number | null
          conversions?: number | null
          cost?: number | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          metric_date?: string
          quality_score?: number | null
          revenue?: number | null
          roas?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_templates: {
        Row: {
          agent_type: string
          chart_config: Json
          created_at: string
          id: string
          is_system_template: boolean | null
          template_name: string
          updated_at: string
        }
        Insert: {
          agent_type: string
          chart_config?: Json
          created_at?: string
          id?: string
          is_system_template?: boolean | null
          template_name: string
          updated_at?: string
        }
        Update: {
          agent_type?: string
          chart_config?: Json
          created_at?: string
          id?: string
          is_system_template?: boolean | null
          template_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          approval_workflow: string | null
          auto_discovered_data: Json | null
          automation_level: string | null
          brand_personality: string | null
          campaign_frequency: string | null
          communication_tone: string | null
          competitive_advantages: string | null
          content_languages: string[] | null
          content_types: string[] | null
          created_at: string
          current_tools: string[] | null
          data_approved: boolean | null
          description: string | null
          experience_level: string | null
          founded: string | null
          id: string
          income_level: string | null
          industry: string | null
          key_kpis: string[] | null
          location: string | null
          main_competitors: Json | null
          monthly_budget_range: string | null
          name: string
          preferred_channels: string[] | null
          primary_goals: string[] | null
          primary_markets: string[] | null
          size: string | null
          social_accounts: Json | null
          target_age_groups: string[] | null
          target_cities: string[] | null
          target_gender: string | null
          team_size: string | null
          updated_at: string
          user_id: string
          website: string | null
          website_platform: string | null
        }
        Insert: {
          approval_workflow?: string | null
          auto_discovered_data?: Json | null
          automation_level?: string | null
          brand_personality?: string | null
          campaign_frequency?: string | null
          communication_tone?: string | null
          competitive_advantages?: string | null
          content_languages?: string[] | null
          content_types?: string[] | null
          created_at?: string
          current_tools?: string[] | null
          data_approved?: boolean | null
          description?: string | null
          experience_level?: string | null
          founded?: string | null
          id?: string
          income_level?: string | null
          industry?: string | null
          key_kpis?: string[] | null
          location?: string | null
          main_competitors?: Json | null
          monthly_budget_range?: string | null
          name: string
          preferred_channels?: string[] | null
          primary_goals?: string[] | null
          primary_markets?: string[] | null
          size?: string | null
          social_accounts?: Json | null
          target_age_groups?: string[] | null
          target_cities?: string[] | null
          target_gender?: string | null
          team_size?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          website_platform?: string | null
        }
        Update: {
          approval_workflow?: string | null
          auto_discovered_data?: Json | null
          automation_level?: string | null
          brand_personality?: string | null
          campaign_frequency?: string | null
          communication_tone?: string | null
          competitive_advantages?: string | null
          content_languages?: string[] | null
          content_types?: string[] | null
          created_at?: string
          current_tools?: string[] | null
          data_approved?: boolean | null
          description?: string | null
          experience_level?: string | null
          founded?: string | null
          id?: string
          income_level?: string | null
          industry?: string | null
          key_kpis?: string[] | null
          location?: string | null
          main_competitors?: Json | null
          monthly_budget_range?: string | null
          name?: string
          preferred_channels?: string[] | null
          primary_goals?: string[] | null
          primary_markets?: string[] | null
          size?: string | null
          social_accounts?: Json | null
          target_age_groups?: string[] | null
          target_cities?: string[] | null
          target_gender?: string | null
          team_size?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          website_platform?: string | null
        }
        Relationships: []
      }
      company_analysis: {
        Row: {
          company_id: string
          competitors: Json | null
          created_at: string
          id: string
          market_insights: Json | null
          recommendations: Json | null
          updated_at: string
        }
        Insert: {
          company_id: string
          competitors?: Json | null
          created_at?: string
          id?: string
          market_insights?: Json | null
          recommendations?: Json | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          competitors?: Json | null
          created_at?: string
          id?: string
          market_insights?: Json | null
          recommendations?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_analysis_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_documents: {
        Row: {
          analysis_results: Json | null
          analysis_status: string | null
          analyzed_at: string | null
          company_id: string | null
          document_name: string
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          mime_type: string | null
          uploaded_at: string
          user_id: string | null
        }
        Insert: {
          analysis_results?: Json | null
          analysis_status?: string | null
          analyzed_at?: string | null
          company_id?: string | null
          document_name: string
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          user_id?: string | null
        }
        Update: {
          analysis_results?: Json | null
          analysis_status?: string | null
          analyzed_at?: string | null
          company_id?: string | null
          document_name?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          uploaded_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          company_id: string | null
          competitor_name: string
          created_at: string | null
          id: string
          market_share: number | null
          strengths: string[] | null
          updated_at: string | null
          weaknesses: string[] | null
          website_url: string | null
        }
        Insert: {
          company_id?: string | null
          competitor_name: string
          created_at?: string | null
          id?: string
          market_share?: number | null
          strengths?: string[] | null
          updated_at?: string | null
          weaknesses?: string[] | null
          website_url?: string | null
        }
        Update: {
          company_id?: string | null
          competitor_name?: string
          created_at?: string | null
          id?: string
          market_share?: number | null
          strengths?: string[] | null
          updated_at?: string | null
          weaknesses?: string[] | null
          website_url?: string | null
        }
        Relationships: []
      }
      content_calendar: {
        Row: {
          campaign_id: string | null
          content_assets: Json | null
          content_text: string | null
          content_type: string | null
          created_at: string | null
          distribution_metrics: Json | null
          hashtags: string[] | null
          id: string
          language: string | null
          platform: string | null
          published_at: string | null
          scheduled_at: string | null
          seo_performance: Json | null
          status: string | null
          target_audience: string | null
          title: string
          topic_clusters: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          content_assets?: Json | null
          content_text?: string | null
          content_type?: string | null
          created_at?: string | null
          distribution_metrics?: Json | null
          hashtags?: string[] | null
          id?: string
          language?: string | null
          platform?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_performance?: Json | null
          status?: string | null
          target_audience?: string | null
          title: string
          topic_clusters?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          content_assets?: Json | null
          content_text?: string | null
          content_type?: string | null
          created_at?: string | null
          distribution_metrics?: Json | null
          hashtags?: string[] | null
          id?: string
          language?: string | null
          platform?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_performance?: Json | null
          status?: string | null
          target_audience?: string | null
          title?: string
          topic_clusters?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      content_performance: {
        Row: {
          clicks: number | null
          comments: number | null
          content_id: string | null
          created_at: string | null
          engagement_rate: number | null
          id: string
          likes: number | null
          metric_date: string
          reach: number | null
          shares: number | null
          user_id: string | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          comments?: number | null
          content_id?: string | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          metric_date: string
          reach?: number | null
          shares?: number | null
          user_id?: string | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          comments?: number | null
          content_id?: string | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          likes?: number | null
          metric_date?: string
          reach?: number | null
          shares?: number | null
          user_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_performance_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_calendar"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_agent_context: {
        Row: {
          context_data: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context_data?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context_data?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_layouts: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          is_default: boolean | null
          layout_config: Json
          layout_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          layout_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          layout_config?: Json
          layout_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          id: string
          metrics: Json
          updated_at: string
        }
        Insert: {
          id: string
          metrics: Json
          updated_at?: string
        }
        Update: {
          id?: string
          metrics?: Json
          updated_at?: string
        }
        Relationships: []
      }
      external_api_configs: {
        Row: {
          access_token_hash: string | null
          api_endpoints: Json | null
          api_key_hash: string | null
          api_secret_hash: string | null
          created_at: string | null
          error_log: Json | null
          health_check: Json | null
          id: string
          last_sync: string | null
          platform: string
          rate_limits: Json | null
          refresh_token_hash: string | null
          status: string | null
          sync_frequency: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token_hash?: string | null
          api_endpoints?: Json | null
          api_key_hash?: string | null
          api_secret_hash?: string | null
          created_at?: string | null
          error_log?: Json | null
          health_check?: Json | null
          id?: string
          last_sync?: string | null
          platform: string
          rate_limits?: Json | null
          refresh_token_hash?: string | null
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token_hash?: string | null
          api_endpoints?: Json | null
          api_key_hash?: string | null
          api_secret_hash?: string | null
          created_at?: string | null
          error_log?: Json | null
          health_check?: Json | null
          id?: string
          last_sync?: string | null
          platform?: string
          rate_limits?: Json | null
          refresh_token_hash?: string | null
          status?: string | null
          sync_frequency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      historical_metrics: {
        Row: {
          dimensions: Json | null
          id: string
          metric_type: string
          timestamp: string
          value: number
        }
        Insert: {
          dimensions?: Json | null
          id?: string
          metric_type: string
          timestamp?: string
          value: number
        }
        Update: {
          dimensions?: Json | null
          id?: string
          metric_type?: string
          timestamp?: string
          value?: number
        }
        Relationships: []
      }
      integrated_analytics: {
        Row: {
          ai_insights: Json | null
          anomaly_detection: Json | null
          competitive_landscape: Json | null
          created_at: string | null
          id: string
          last_updated: string | null
          opportunity_analysis: Json | null
          predictions: Json | null
          processing_status: string | null
          recommended_actions: Json | null
          trend_analysis: Json | null
          unified_metrics: Json | null
          user_id: string | null
        }
        Insert: {
          ai_insights?: Json | null
          anomaly_detection?: Json | null
          competitive_landscape?: Json | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          opportunity_analysis?: Json | null
          predictions?: Json | null
          processing_status?: string | null
          recommended_actions?: Json | null
          trend_analysis?: Json | null
          unified_metrics?: Json | null
          user_id?: string | null
        }
        Update: {
          ai_insights?: Json | null
          anomaly_detection?: Json | null
          competitive_landscape?: Json | null
          created_at?: string | null
          id?: string
          last_updated?: string | null
          opportunity_analysis?: Json | null
          predictions?: Json | null
          processing_status?: string | null
          recommended_actions?: Json | null
          trend_analysis?: Json | null
          unified_metrics?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          ab_testing_results: Json | null
          attribution_data: Json | null
          budget: number | null
          budget_allocation: Json | null
          conversion_funnel: Json | null
          created_at: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          id: string
          kpis: Json | null
          name: string
          performance_data: Json | null
          start_date: string | null
          status: string | null
          target_market: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ab_testing_results?: Json | null
          attribution_data?: Json | null
          budget?: number | null
          budget_allocation?: Json | null
          conversion_funnel?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          kpis?: Json | null
          name: string
          performance_data?: Json | null
          start_date?: string | null
          status?: string | null
          target_market?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ab_testing_results?: Json | null
          attribution_data?: Json | null
          budget?: number | null
          budget_allocation?: Json | null
          conversion_funnel?: Json | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          kpis?: Json | null
          name?: string
          performance_data?: Json | null
          start_date?: string | null
          status?: string | null
          target_market?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      marketing_context: {
        Row: {
          active_channels: string[] | null
          annual_budget: number | null
          available_content_assets: string[] | null
          company_id: string | null
          created_at: string | null
          id: string
          marketing_tools: string[] | null
          successful_campaigns: Json | null
          updated_at: string | null
        }
        Insert: {
          active_channels?: string[] | null
          annual_budget?: number | null
          available_content_assets?: string[] | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          marketing_tools?: string[] | null
          successful_campaigns?: Json | null
          updated_at?: string | null
        }
        Update: {
          active_channels?: string[] | null
          annual_budget?: number | null
          available_content_assets?: string[] | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          marketing_tools?: string[] | null
          successful_campaigns?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      morvo_conversations: {
        Row: {
          content: string
          context_data: Json | null
          conversation_id: string
          created_at: string | null
          id: string
          message_type: string
          user_id: string | null
        }
        Insert: {
          content: string
          context_data?: Json | null
          conversation_id: string
          created_at?: string | null
          id?: string
          message_type: string
          user_id?: string | null
        }
        Update: {
          content?: string
          context_data?: Json | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          message_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      onboarding_responses: {
        Row: {
          id: string
          question_id: string
          response: string
          session_id: string
          timestamp: string | null
        }
        Insert: {
          id?: string
          question_id: string
          response: string
          session_id: string
          timestamp?: string | null
        }
        Update: {
          id?: string
          question_id?: string
          response?: string
          session_id?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "onboarding_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          created_at: string | null
          current_question: string | null
          discovery_progress: number | null
          id: string
          language: string | null
          session_id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          current_question?: string | null
          discovery_progress?: number | null
          id?: string
          language?: string | null
          session_id: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          current_question?: string | null
          discovery_progress?: number | null
          id?: string
          language?: string | null
          session_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      reasoning_chains: {
        Row: {
          agent_id: string | null
          conversation_id: string | null
          id: string
          reasoning: string | null
          result: string | null
          step_order: number | null
        }
        Insert: {
          agent_id?: string | null
          conversation_id?: string | null
          id?: string
          reasoning?: string | null
          result?: string | null
          step_order?: number | null
        }
        Update: {
          agent_id?: string | null
          conversation_id?: string | null
          id?: string
          reasoning?: string | null
          result?: string | null
          step_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reasoning_chains_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_data: {
        Row: {
          annual_revenue: number | null
          company_id: string | null
          conversion_rate: number | null
          created_at: string
          customer_acquisition_cost: number | null
          customer_lifetime_value: number | null
          id: string
          monthly_average_sales: number | null
          sales_channels: Json | null
          sales_process_description: string | null
          sales_team_size: number | null
          top_selling_products: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          annual_revenue?: number | null
          company_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          customer_acquisition_cost?: number | null
          customer_lifetime_value?: number | null
          id?: string
          monthly_average_sales?: number | null
          sales_channels?: Json | null
          sales_process_description?: string | null
          sales_team_size?: number | null
          top_selling_products?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          annual_revenue?: number | null
          company_id?: string | null
          conversion_rate?: number | null
          created_at?: string
          customer_acquisition_cost?: number | null
          customer_lifetime_value?: number | null
          id?: string
          monthly_average_sales?: number | null
          sales_channels?: Json | null
          sales_process_description?: string | null
          sales_team_size?: number | null
          top_selling_products?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_data_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      semrush_competitors: {
        Row: {
          adwords_keywords: number | null
          common_keywords: number | null
          competitive_level: string | null
          competitor_domain: string
          domain: string
          id: string
          last_analyzed: string | null
          se_keywords: number | null
          traffic_similarity: number | null
          user_id: string | null
        }
        Insert: {
          adwords_keywords?: number | null
          common_keywords?: number | null
          competitive_level?: string | null
          competitor_domain: string
          domain: string
          id?: string
          last_analyzed?: string | null
          se_keywords?: number | null
          traffic_similarity?: number | null
          user_id?: string | null
        }
        Update: {
          adwords_keywords?: number | null
          common_keywords?: number | null
          competitive_level?: string | null
          competitor_domain?: string
          domain?: string
          id?: string
          last_analyzed?: string | null
          se_keywords?: number | null
          traffic_similarity?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      semrush_data: {
        Row: {
          api_cost: number | null
          created_at: string | null
          data_type: string
          database_region: string | null
          domain: string
          expires_at: string | null
          fetched_at: string | null
          id: string
          is_cached: boolean | null
          query_params: Json | null
          response_data: Json
          user_id: string | null
        }
        Insert: {
          api_cost?: number | null
          created_at?: string | null
          data_type: string
          database_region?: string | null
          domain: string
          expires_at?: string | null
          fetched_at?: string | null
          id?: string
          is_cached?: boolean | null
          query_params?: Json | null
          response_data: Json
          user_id?: string | null
        }
        Update: {
          api_cost?: number | null
          created_at?: string | null
          data_type?: string
          database_region?: string | null
          domain?: string
          expires_at?: string | null
          fetched_at?: string | null
          id?: string
          is_cached?: boolean | null
          query_params?: Json | null
          response_data?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      semrush_keywords: {
        Row: {
          competition: number | null
          cpc: number | null
          difficulty_score: number | null
          domain: string | null
          id: string
          keyword: string
          last_updated: string | null
          position: number | null
          search_volume: number | null
          trends: Json | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          competition?: number | null
          cpc?: number | null
          difficulty_score?: number | null
          domain?: string | null
          id?: string
          keyword: string
          last_updated?: string | null
          position?: number | null
          search_volume?: number | null
          trends?: Json | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          competition?: number | null
          cpc?: number | null
          difficulty_score?: number | null
          domain?: string | null
          id?: string
          keyword?: string
          last_updated?: string | null
          position?: number | null
          search_volume?: number | null
          trends?: Json | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          access_token: string | null
          account_handle: string | null
          account_id: string | null
          company_id: string | null
          connected_at: string
          engagement_metrics: Json | null
          goals: string[] | null
          id: string
          permissions: Json | null
          platform: string
          posting_frequency: string | null
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          account_handle?: string | null
          account_id?: string | null
          company_id?: string | null
          connected_at?: string
          engagement_metrics?: Json | null
          goals?: string[] | null
          id?: string
          permissions?: Json | null
          platform: string
          posting_frequency?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          account_handle?: string | null
          account_id?: string | null
          company_id?: string | null
          connected_at?: string
          engagement_metrics?: Json | null
          goals?: string[] | null
          id?: string
          permissions?: Json | null
          platform?: string
          posting_frequency?: string | null
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_media_analytics: {
        Row: {
          account_handle: string | null
          audience_insights: Json | null
          content_performance: Json | null
          created_at: string | null
          data_source: string | null
          engagement_data: Json | null
          growth_data: Json | null
          id: string
          last_updated: string | null
          metrics: Json
          platform: string
          user_id: string | null
        }
        Insert: {
          account_handle?: string | null
          audience_insights?: Json | null
          content_performance?: Json | null
          created_at?: string | null
          data_source?: string | null
          engagement_data?: Json | null
          growth_data?: Json | null
          id?: string
          last_updated?: string | null
          metrics: Json
          platform: string
          user_id?: string | null
        }
        Update: {
          account_handle?: string | null
          audience_insights?: Json | null
          content_performance?: Json | null
          created_at?: string | null
          data_source?: string | null
          engagement_data?: Json | null
          growth_data?: Json | null
          id?: string
          last_updated?: string | null
          metrics?: Json
          platform?: string
          user_id?: string | null
        }
        Relationships: []
      }
      social_mentions: {
        Row: {
          author_followers: number | null
          author_handle: string | null
          content: string | null
          crisis_level: string | null
          detected_at: string | null
          engagement_count: number | null
          id: string
          is_crisis: boolean | null
          mention_type: string | null
          mentioned_at: string | null
          platform: string
          post_url: string | null
          sentiment_label: string | null
          sentiment_score: number | null
          social_account_id: string | null
          user_id: string | null
        }
        Insert: {
          author_followers?: number | null
          author_handle?: string | null
          content?: string | null
          crisis_level?: string | null
          detected_at?: string | null
          engagement_count?: number | null
          id?: string
          is_crisis?: boolean | null
          mention_type?: string | null
          mentioned_at?: string | null
          platform: string
          post_url?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          social_account_id?: string | null
          user_id?: string | null
        }
        Update: {
          author_followers?: number | null
          author_handle?: string | null
          content?: string | null
          crisis_level?: string | null
          detected_at?: string | null
          engagement_count?: number | null
          id?: string
          is_crisis?: boolean | null
          mention_type?: string | null
          mentioned_at?: string | null
          platform?: string
          post_url?: string | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          social_account_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "social_mentions_social_account_id_fkey"
            columns: ["social_account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      social_monitoring: {
        Row: {
          audience_insights: Json | null
          company_id: string | null
          created_at: string
          engagement_metrics: Json | null
          follower_growth: Json | null
          id: string
          monitoring_date: string
          platform_comparison: Json | null
          sentiment_analysis: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audience_insights?: Json | null
          company_id?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          follower_growth?: Json | null
          id?: string
          monitoring_date?: string
          platform_comparison?: Json | null
          sentiment_analysis?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audience_insights?: Json | null
          company_id?: string | null
          created_at?: string
          engagement_metrics?: Json | null
          follower_growth?: Json | null
          id?: string
          monitoring_date?: string
          platform_comparison?: Json | null
          sentiment_analysis?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      strategic_analyses: {
        Row: {
          analysis_date: string
          company_id: string | null
          competitor_data: Json | null
          created_at: string
          id: string
          kpi_metrics: Json | null
          market_trends: Json | null
          positioning_map: Json | null
          swot_analysis: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_date?: string
          company_id?: string | null
          competitor_data?: Json | null
          created_at?: string
          id?: string
          kpi_metrics?: Json | null
          market_trends?: Json | null
          positioning_map?: Json | null
          swot_analysis?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_date?: string
          company_id?: string | null
          competitor_data?: Json | null
          created_at?: string
          id?: string
          kpi_metrics?: Json | null
          market_trends?: Json | null
          positioning_map?: Json | null
          swot_analysis?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_metrics: {
        Row: {
          id: string
          metrics: Json
          updated_at: string
        }
        Insert: {
          id: string
          metrics: Json
          updated_at?: string
        }
        Update: {
          id?: string
          metrics?: Json
          updated_at?: string
        }
        Relationships: []
      }
      system_prompts: {
        Row: {
          created_at: string | null
          id: string
          industry_tone: string | null
          is_active: boolean | null
          name: string
          prompt_text: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry_tone?: string | null
          is_active?: boolean | null
          name: string
          prompt_text: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry_tone?: string | null
          is_active?: boolean | null
          name?: string
          prompt_text?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      system_status: {
        Row: {
          alert_level: string | null
          details: Json | null
          id: string
          last_check: string
          status: string
        }
        Insert: {
          alert_level?: string | null
          details?: Json | null
          id: string
          last_check?: string
          status: string
        }
        Update: {
          alert_level?: string | null
          details?: Json | null
          id?: string
          last_check?: string
          status?: string
        }
        Relationships: []
      }
      target_audiences: {
        Row: {
          company_id: string | null
          created_at: string | null
          decision_makers: string[] | null
          demographics: Json
          id: string
          pain_points: string[] | null
          sales_cycle_length: string | null
          segment_type: string
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          decision_makers?: string[] | null
          demographics: Json
          id?: string
          pain_points?: string[] | null
          sales_cycle_length?: string | null
          segment_type: string
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          decision_makers?: string[] | null
          demographics?: Json
          id?: string
          pain_points?: string[] | null
          sales_cycle_length?: string | null
          segment_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      test_connection: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      training_data: {
        Row: {
          complexity: string | null
          conversation_id: string
          outcome_rating: number | null
        }
        Insert: {
          complexity?: string | null
          conversation_id: string
          outcome_rating?: number | null
        }
        Update: {
          complexity?: string | null
          conversation_id?: string
          outcome_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "training_data_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: true
            referencedRelation: "agent_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      unified_customer_data: {
        Row: {
          data_payload: Json
          data_type: string
          id: string
          kpi_metrics: Json | null
          last_synced: string | null
          source_platform: string | null
          user_id: string | null
        }
        Insert: {
          data_payload: Json
          data_type: string
          id?: string
          kpi_metrics?: Json | null
          last_synced?: string | null
          source_platform?: string | null
          user_id?: string | null
        }
        Update: {
          data_payload?: Json
          data_type?: string
          id?: string
          kpi_metrics?: Json | null
          last_synced?: string | null
          source_platform?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_ai_preferences: {
        Row: {
          communication_style: string | null
          created_at: string
          expertise_level: string | null
          id: string
          language_preferences: Json | null
          output_format: string | null
          preferred_agents: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          communication_style?: string | null
          created_at?: string
          expertise_level?: string | null
          id?: string
          language_preferences?: Json | null
          output_format?: string | null
          preferred_agents?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          communication_style?: string | null
          created_at?: string
          expertise_level?: string | null
          id?: string
          language_preferences?: Json | null
          output_format?: string | null
          preferred_agents?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          category: string | null
          created_at: string
          feedback_text: string | null
          id: string
          rating: number | null
          resolution_notes: string | null
          resolved: boolean
          user_id: string
          workflow_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          resolution_notes?: string | null
          resolved?: boolean
          user_id: string
          workflow_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number | null
          resolution_notes?: string | null
          resolved?: boolean
          user_id?: string
          workflow_id?: string | null
        }
        Relationships: []
      }
      user_onboarding: {
        Row: {
          completed: boolean
          completed_at: string | null
          current_step: number
          id: string
          last_active_at: string
          progress: Json
          started_at: string
          total_steps: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          current_step?: number
          id?: string
          last_active_at?: string
          progress?: Json
          started_at?: string
          total_steps?: number
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          current_step?: number
          id?: string
          last_active_at?: string
          progress?: Json
          started_at?: string
          total_steps?: number
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          communication_style: string | null
          created_at: string | null
          focus_areas: string[] | null
          id: string
          notification_preferences: Json | null
          reporting_format: string | null
          update_frequency: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          communication_style?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          id?: string
          notification_preferences?: Json | null
          reporting_format?: string | null
          update_frequency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          communication_style?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          id?: string
          notification_preferences?: Json | null
          reporting_format?: string | null
          update_frequency?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          organization: string | null
          preferences: Json | null
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          organization?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization?: string | null
          preferences?: Json | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_saved_workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_favorite: boolean
          last_used_at: string | null
          name: string
          updated_at: string
          user_id: string
          workflow_template: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          last_used_at?: string | null
          name: string
          updated_at?: string
          user_id: string
          workflow_template: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_favorite?: boolean
          last_used_at?: string | null
          name?: string
          updated_at?: string
          user_id?: string
          workflow_template?: Json
        }
        Relationships: []
      }
      user_tutorials: {
        Row: {
          completed: boolean
          completed_at: string | null
          feedback: Json | null
          id: string
          progress: number
          started_at: string
          tutorial_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          feedback?: Json | null
          id?: string
          progress?: number
          started_at?: string
          tutorial_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          feedback?: Json | null
          id?: string
          progress?: number
          started_at?: string
          tutorial_id?: string
          user_id?: string
        }
        Relationships: []
      }
      visualization_preferences: {
        Row: {
          chart_type: string
          created_at: string
          id: string
          preferences: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          chart_type: string
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          chart_type?: string
          created_at?: string
          id?: string
          preferences?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      user_owns_company: {
        Args:
          | { company_id: string }
          | { p_user_id: string; p_company_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
