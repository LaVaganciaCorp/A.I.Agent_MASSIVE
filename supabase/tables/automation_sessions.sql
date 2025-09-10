CREATE TABLE automation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'idle',
    progress INTEGER DEFAULT 0,
    current_step INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    user_id UUID
);