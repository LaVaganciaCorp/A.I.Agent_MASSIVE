CREATE TABLE execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    step_index INTEGER,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID
);