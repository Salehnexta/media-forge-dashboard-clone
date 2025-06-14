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
          client_id: string
          context: Json
          correlation_id: string
          created_at: string
          error: string | null
          id: string
          parent_message_id: string | null
          payload: Json
          processing_time_ms: number | null
          project_id: string
          recipient_agent_id: string
          response: Json | null
          sender_agent_id: string
          status: string
          task_type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          context?: Json
          correlation_id: string
          created_at?: string
          error?: string | null
          id?: string
          parent_message_id?: string | null
          payload?: Json
          processing_time_ms?: number | null
          project_id: string
          recipient_agent_id: string
          response?: Json | null
          sender_agent_id: string
          status?: string
          task_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          context?: Json
          correlation_id?: string
          created_at?: string
          error?: string | null
          id?: string
          parent_message_id?: string | null
          payload?: Json
          processing_time_ms?: number | null
          project_id?: string
          recipient_agent_id?: string
          response?: Json | null
          sender_agent_id?: string
          status?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "a2a_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "a2a_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "a2a_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "a2a_messages_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_performance_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          platform: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          platform: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          platform?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_performance_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_performance_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_activity_log: {
        Row: {
          activity_type: string
          agent_id: string
          client_id: string
          description: string | null
          emotional_tone: string | null
          id: string
          metrics: Json | null
          project_id: string
          timestamp: string
        }
        Insert: {
          activity_type: string
          agent_id: string
          client_id: string
          description?: string | null
          emotional_tone?: string | null
          id?: string
          metrics?: Json | null
          project_id: string
          timestamp?: string
        }
        Update: {
          activity_type?: string
          agent_id?: string
          client_id?: string
          description?: string | null
          emotional_tone?: string | null
          id?: string
          metrics?: Json | null
          project_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_activity_log_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_memory: {
        Row: {
          agent_id: string
          client_id: string
          content: Json
          conversation_id: string | null
          created_at: string
          embedding: string | null
          expires_at: string | null
          id: string
          importance_score: number | null
          memory_type: string
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          agent_id: string
          client_id: string
          content?: Json
          conversation_id?: string | null
          created_at?: string
          embedding?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type?: string
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          agent_id?: string
          client_id?: string
          content?: Json
          conversation_id?: string | null
          created_at?: string
          embedding?: string | null
          expires_at?: string | null
          id?: string
          importance_score?: number | null
          memory_type?: string
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_memory_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          agent_id: string
          id: string
          response_time: number | null
          success_rate: number | null
          task_id: string
          timestamp: string | null
          tokens_used: number | null
        }
        Insert: {
          agent_id: string
          id?: string
          response_time?: number | null
          success_rate?: number | null
          task_id: string
          timestamp?: string | null
          tokens_used?: number | null
        }
        Update: {
          agent_id?: string
          id?: string
          response_time?: number | null
          success_rate?: number | null
          task_id?: string
          timestamp?: string | null
          tokens_used?: number | null
        }
        Relationships: []
      }
      agent_performance: {
        Row: {
          agent_id: string
          client_id: string
          created_at: string
          error_type: string | null
          id: string
          processing_time_ms: number
          project_id: string
          success: boolean
          task_type: string
          tokens_used: number | null
        }
        Insert: {
          agent_id: string
          client_id: string
          created_at?: string
          error_type?: string | null
          id?: string
          processing_time_ms: number
          project_id: string
          success: boolean
          task_type: string
          tokens_used?: number | null
        }
        Update: {
          agent_id?: string
          client_id?: string
          created_at?: string
          error_type?: string | null
          id?: string
          processing_time_ms?: number
          project_id?: string
          success?: boolean
          task_type?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_performance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_performance_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          active: boolean
          agent_id: string
          created_at: string
          description: string | null
          goal: string | null
          name: string
          type: string
        }
        Insert: {
          active?: boolean
          agent_id: string
          created_at?: string
          description?: string | null
          goal?: string | null
          name: string
          type: string
        }
        Update: {
          active?: boolean
          agent_id?: string
          created_at?: string
          description?: string | null
          goal?: string | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      ai_insights: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string
          id: string
          insight_type: string
          project_id: string | null
          source_data_ref: string | null
        }
        Insert: {
          client_id?: string | null
          content: Json
          created_at?: string
          id?: string
          insight_type: string
          project_id?: string | null
          source_data_ref?: string | null
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string
          id?: string
          insight_type?: string
          project_id?: string | null
          source_data_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          metric_type: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          metric_type: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          metric_type?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          api_key: string
          created_at: string
          id: string
          name: string
          quota_limit: number
          quota_used: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          api_key?: string
          created_at?: string
          id?: string
          name: string
          quota_limit?: number
          quota_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          api_key?: string
          created_at?: string
          id?: string
          name?: string
          quota_limit?: number
          quota_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      content_sources_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          project_id: string | null
          source_type: string
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          project_id?: string | null
          source_type: string
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          project_id?: string | null
          source_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_sources_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_sources_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          client_id: string
          content: string
          conversation_id: string | null
          created_at: string
          emotion_analysis: Json | null
          id: string
          metadata: Json | null
          sender_id: string
          sender_type: string
          timestamp: string
        }
        Insert: {
          client_id: string
          content: string
          conversation_id?: string | null
          created_at?: string
          emotion_analysis?: Json | null
          id?: string
          metadata?: Json | null
          sender_id: string
          sender_type: string
          timestamp?: string
        }
        Update: {
          client_id?: string
          content?: string
          conversation_id?: string | null
          created_at?: string
          emotion_analysis?: Json | null
          id?: string
          metadata?: Json | null
          sender_id?: string
          sender_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      email_performance_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          metric_type: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          metric_type: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          metric_type?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_performance_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_performance_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      embeddings: {
        Row: {
          client_id: string
          content: string
          created_at: string
          id: string
          metadata: Json
          project_id: string
        }
        Insert: {
          client_id: string
          content: string
          created_at?: string
          id?: string
          metadata?: Json
          project_id: string
        }
        Update: {
          client_id?: string
          content?: string
          created_at?: string
          id?: string
          metadata?: Json
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "embeddings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embeddings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_journey: {
        Row: {
          adaptation_strategy: string | null
          client_id: string
          emotion_confidence: number | null
          emotional_context: string | null
          engagement_level: string | null
          id: string
          primary_emotion: string | null
          project_id: string
          satisfaction_score: number | null
          stage: string
          timestamp: string
        }
        Insert: {
          adaptation_strategy?: string | null
          client_id: string
          emotion_confidence?: number | null
          emotional_context?: string | null
          engagement_level?: string | null
          id?: string
          primary_emotion?: string | null
          project_id: string
          satisfaction_score?: number | null
          stage: string
          timestamp?: string
        }
        Update: {
          adaptation_strategy?: string | null
          client_id?: string
          emotion_confidence?: number | null
          emotional_context?: string | null
          engagement_level?: string | null
          id?: string
          primary_emotion?: string | null
          project_id?: string
          satisfaction_score?: number | null
          stage?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_journey_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotional_journey_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      emotional_milestones: {
        Row: {
          client_id: string
          description: string | null
          emotion_after: string | null
          emotion_before: string | null
          id: string
          milestone_type: string
          project_id: string
          stage: string
          timestamp: string
        }
        Insert: {
          client_id: string
          description?: string | null
          emotion_after?: string | null
          emotion_before?: string | null
          id?: string
          milestone_type: string
          project_id: string
          stage: string
          timestamp?: string
        }
        Update: {
          client_id?: string
          description?: string | null
          emotion_after?: string | null
          emotion_before?: string | null
          id?: string
          milestone_type?: string
          project_id?: string
          stage?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_milestones_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emotional_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_recommendations: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string
          id: string
          project_id: string | null
          recommendation_type: string
        }
        Insert: {
          client_id?: string | null
          content: Json
          created_at?: string
          id?: string
          project_id?: string | null
          recommendation_type: string
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string
          id?: string
          project_id?: string | null
          recommendation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "optimization_recommendations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "optimization_recommendations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      predictive_analytics: {
        Row: {
          client_id: string | null
          content: Json
          created_at: string
          forecast_type: string
          id: string
          project_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: Json
          created_at?: string
          forecast_type: string
          id?: string
          project_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: Json
          created_at?: string
          forecast_type?: string
          id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "predictive_analytics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictive_analytics_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          active: boolean
          client_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      social_media_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          platform: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          platform: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          platform?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_media_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_media_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          cpu_load: number | null
          created_at: string
          id: string
          memory_usage: number | null
        }
        Insert: {
          cpu_load?: number | null
          created_at?: string
          id?: string
          memory_usage?: number | null
        }
        Update: {
          cpu_load?: number | null
          created_at?: string
          id?: string
          memory_usage?: number | null
        }
        Relationships: []
      }
      task_results: {
        Row: {
          client_id: string
          completed_at: string | null
          correlation_id: string
          created_at: string
          error: string | null
          id: string
          project_id: string
          request: Json
          result: Json | null
          status: string
          task_type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          correlation_id: string
          created_at?: string
          error?: string | null
          id?: string
          project_id: string
          request?: Json
          result?: Json | null
          status?: string
          task_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          correlation_id?: string
          created_at?: string
          error?: string | null
          id?: string
          project_id?: string
          request?: Json
          result?: Json | null
          status?: string
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_results_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_results_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      website_intel_data: {
        Row: {
          client_id: string | null
          data: Json
          id: string
          metric_type: string
          project_id: string | null
          timestamp: string
        }
        Insert: {
          client_id?: string | null
          data: Json
          id?: string
          metric_type: string
          project_id?: string | null
          timestamp?: string
        }
        Update: {
          client_id?: string | null
          data?: Json
          id?: string
          metric_type?: string
          project_id?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "website_intel_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "website_intel_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_user_onboarding_update: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
