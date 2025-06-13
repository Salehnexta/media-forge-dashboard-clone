
-- RLS Policies for client-based access control

-- Clients table - users can only access their own client record
CREATE POLICY "Users can view their own client" ON public.clients
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own client" ON public.clients
FOR UPDATE USING (auth.uid() = user_id);

-- Projects table - users can access projects for their client
CREATE POLICY "Users can view their projects" ON public.projects
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their projects" ON public.projects
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their projects" ON public.projects
FOR UPDATE USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their projects" ON public.projects
FOR DELETE USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- A2A Messages - users can access messages for their clients
CREATE POLICY "Users can view their a2a messages" ON public.a2a_messages
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their a2a messages" ON public.a2a_messages
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Ad Performance Data
CREATE POLICY "Users can view their ad performance data" ON public.ad_performance_data
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their ad performance data" ON public.ad_performance_data
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Agent Activity Log
CREATE POLICY "Users can view their agent activity log" ON public.agent_activity_log
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their agent activity log" ON public.agent_activity_log
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Agent Performance
CREATE POLICY "Users can view their agent performance" ON public.agent_performance
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their agent performance" ON public.agent_performance
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- AI Insights
CREATE POLICY "Users can view their ai insights" ON public.ai_insights
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their ai insights" ON public.ai_insights
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Analytics Data
CREATE POLICY "Users can view their analytics data" ON public.analytics_data
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their analytics data" ON public.analytics_data
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Content Sources Data
CREATE POLICY "Users can view their content sources data" ON public.content_sources_data
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their content sources data" ON public.content_sources_data
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Conversation Messages
CREATE POLICY "Users can view their conversation messages" ON public.conversation_messages
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their conversation messages" ON public.conversation_messages
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Email Performance Data
CREATE POLICY "Users can view their email performance data" ON public.email_performance_data
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their email performance data" ON public.email_performance_data
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Embeddings
CREATE POLICY "Users can view their embeddings" ON public.embeddings
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their embeddings" ON public.embeddings
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Emotional Journey
CREATE POLICY "Users can view their emotional journey" ON public.emotional_journey
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their emotional journey" ON public.emotional_journey
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Emotional Milestones
CREATE POLICY "Users can view their emotional milestones" ON public.emotional_milestones
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their emotional milestones" ON public.emotional_milestones
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Optimization Recommendations
CREATE POLICY "Users can view their optimization recommendations" ON public.optimization_recommendations
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their optimization recommendations" ON public.optimization_recommendations
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Predictive Analytics
CREATE POLICY "Users can view their predictive analytics" ON public.predictive_analytics
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their predictive analytics" ON public.predictive_analytics
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Social Media Data
CREATE POLICY "Users can view their social media data" ON public.social_media_data
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their social media data" ON public.social_media_data
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Task Results
CREATE POLICY "Users can view their task results" ON public.task_results
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their task results" ON public.task_results
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their task results" ON public.task_results
FOR UPDATE USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Website Intel Data
CREATE POLICY "Users can view their website intel data" ON public.website_intel_data
FOR SELECT USING (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their website intel data" ON public.website_intel_data
FOR INSERT WITH CHECK (
  client_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  )
);

-- Agents table - public read access (no user-specific data)
CREATE POLICY "Anyone can view agents" ON public.agents
FOR SELECT USING (true);

-- System Metrics - public read access (system-wide data)
CREATE POLICY "Anyone can view system metrics" ON public.system_metrics
FOR SELECT USING (true);
