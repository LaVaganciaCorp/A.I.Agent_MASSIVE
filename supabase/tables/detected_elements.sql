CREATE TABLE detected_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255),
    element_type VARCHAR(50) NOT NULL,
    bounds JSONB NOT NULL,
    text_content TEXT,
    attributes JSONB,
    confidence DECIMAL(4,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID
);