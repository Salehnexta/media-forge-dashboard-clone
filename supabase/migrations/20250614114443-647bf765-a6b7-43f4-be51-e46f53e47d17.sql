
-- Create missing tables with exact schema requirements

-- 1. Fix agent_memory table to match application expectations
DROP TABLE IF EXISTS agent_memory;
CREATE TABLE agent_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT NOT NULL,
    client_id UUID NOT NULL,
    conversation_id UUID,
    interaction_type TEXT NOT NULL DEFAULT 'chat',
    memory_type TEXT NOT NULL DEFAULT 'conversation',
    content JSONB NOT NULL DEFAULT '{}',
    importance_score FLOAT DEFAULT 0.5,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- 2. Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    title TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id),
    client_id UUID NOT NULL,
    content TEXT NOT NULL,
    role TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- 4. Create tasks table for A2A coordination
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL,
    agent_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    payload JSONB DEFAULT '{}',
    result JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. Create companies table (referenced by code)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    industry TEXT,
    website TEXT,
    description TEXT,
    primary_markets TEXT[],
    size TEXT,
    founded INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create agent_results table (referenced by code)
CREATE TABLE IF NOT EXISTS agent_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id TEXT NOT NULL,
    task_type TEXT NOT NULL,
    input_data JSONB,
    output_data JSONB,
    status TEXT DEFAULT 'pending',
    execution_time_ms INTEGER,
    user_id UUID,
    company_id UUID,
    chart_configs JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE agent_memory ADD CONSTRAINT agent_memory_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE conversations ADD CONSTRAINT conversations_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE messages ADD CONSTRAINT messages_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE tasks ADD CONSTRAINT tasks_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_memory_agent_id ON agent_memory(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_client_id ON agent_memory(client_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_conversation_id ON agent_memory(conversation_id);
CREATE INDEX IF NOT EXISTS idx_agent_memory_timestamp ON agent_memory(timestamp);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_agent_id ON tasks(agent_id);

-- Enable RLS on all tables
ALTER TABLE agent_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access their own agent memory" ON agent_memory
    FOR ALL USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can access their own conversations" ON conversations
    FOR ALL USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can access their own messages" ON messages
    FOR ALL USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can access their own tasks" ON tasks
    FOR ALL USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can access their own companies" ON companies
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can access their own agent results" ON agent_results
    FOR ALL USING (user_id = auth.uid());

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;
