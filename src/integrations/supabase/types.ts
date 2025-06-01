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
      agent_results: {
        Row: {
          agent_id: string
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
        Relationships: [
          {
            foreignKeyName: "analytics_access_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bi_reports: {
        Row: {
          created_at: string | null
          data_sources: Json | null
          generated_at: string | null
          id: string
          insights: Json | null
          recommendations: Json | null
          report_data: Json
          report_name: string
          report_type: string | null
          time_period_end: string | null
          time_period_start: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_sources?: Json | null
          generated_at?: string | null
          id?: string
          insights?: Json | null
          recommendations?: Json | null
          report_data: Json
          report_name: string
          report_type?: string | null
          time_period_end?: string | null
          time_period_start?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_sources?: Json | null
          generated_at?: string | null
          id?: string
          insights?: Json | null
          recommendations?: Json | null
          report_data?: Json
          report_name?: string
          report_type?: string | null
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
        Relationships: [
          {
            foreignKeyName: "brand_positioning_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
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
        Relationships: [
          {
            foreignKeyName: "business_goals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      companies: {
        Row: {
          created_at: string
          description: string | null
          founded: string | null
          id: string
          industry: string | null
          location: string | null
          name: string
          size: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          founded?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          name: string
          size?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          founded?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          name?: string
          size?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
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
      company_profiles: {
        Row: {
          company_description: string | null
          company_name: string
          company_size: number
          created_at: string | null
          headquarters: string | null
          id: string
          industry: string
          logo_url: string | null
          target_markets: string[] | null
          updated_at: string | null
          user_id: string | null
          website_url: string | null
          years_in_business: number | null
        }
        Insert: {
          company_description?: string | null
          company_name: string
          company_size: number
          created_at?: string | null
          headquarters?: string | null
          id?: string
          industry: string
          logo_url?: string | null
          target_markets?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Update: {
          company_description?: string | null
          company_name?: string
          company_size?: number
          created_at?: string | null
          headquarters?: string | null
          id?: string
          industry?: string
          logo_url?: string | null
          target_markets?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          website_url?: string | null
          years_in_business?: number | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "competitors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_calendar: {
        Row: {
          campaign_id: string | null
          content_assets: Json | null
          content_text: string | null
          content_type: string | null
          created_at: string | null
          hashtags: string[] | null
          id: string
          language: string | null
          platform: string | null
          published_at: string | null
          scheduled_at: string | null
          status: string | null
          target_audience: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          content_assets?: Json | null
          content_text?: string | null
          content_type?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          language?: string | null
          platform?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          content_assets?: Json | null
          content_text?: string | null
          content_type?: string | null
          created_at?: string | null
          hashtags?: string[] | null
          id?: string
          language?: string | null
          platform?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          status?: string | null
          target_audience?: string | null
          title?: string
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
      language_preferences: {
        Row: {
          company_id: string | null
          created_at: string | null
          cultural_considerations: Json | null
          id: string
          primary_language: string
          regional_regulations: string[] | null
          secondary_languages: string[] | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          cultural_considerations?: Json | null
          id?: string
          primary_language: string
          regional_regulations?: string[] | null
          secondary_languages?: string[] | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          cultural_considerations?: Json | null
          id?: string
          primary_language?: string
          regional_regulations?: string[] | null
          secondary_languages?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "language_preferences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          id: string
          kpis: Json | null
          name: string
          start_date: string | null
          status: string | null
          target_market: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          kpis?: Json | null
          name: string
          start_date?: string | null
          status?: string | null
          target_market?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          kpis?: Json | null
          name?: string
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
        Relationships: [
          {
            foreignKeyName: "marketing_context_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "social_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "target_audiences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_owns_company: {
        Args: { company_id: string }
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
