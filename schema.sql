-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    google_id TEXT,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    destination_id TEXT NOT NULL,
    destination_name TEXT,
    review_text TEXT,
    ai_label TEXT,
    ai_confidence FLOAT8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
