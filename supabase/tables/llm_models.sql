CREATE TABLE llm_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    model_key TEXT NOT NULL,
    capabilities JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    cost_per_token DECIMAL(10,8),
    max_context_length INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);