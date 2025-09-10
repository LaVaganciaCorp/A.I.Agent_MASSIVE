CREATE TABLE plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    version TEXT NOT NULL,
    author TEXT,
    description TEXT,
    category TEXT,
    capabilities JSONB DEFAULT '{}',
    config JSONB DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    install_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);