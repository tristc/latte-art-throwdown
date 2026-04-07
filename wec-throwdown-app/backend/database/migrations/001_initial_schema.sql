-- WEC Latte Art Throwdown Platform Database Schema
-- Run this migration to set up the complete database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (competitors, organizers, staff)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    phone VARCHAR(20),
    profile_photo_url TEXT,
    bio TEXT,
    skill_level VARCHAR(20) CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    instagram_handle VARCHAR(50),
    role VARCHAR(20) DEFAULT 'competitor' CHECK (role IN ('competitor', 'organizer', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location_name VARCHAR(255) NOT NULL,
    location_address TEXT,
    location_city VARCHAR(100),
    location_country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    format VARCHAR(20) DEFAULT 'single_elimination' CHECK (format IN ('single_elimination', 'double_elimination', 'swiss', 'round_robin')),
    bracket_size INTEGER DEFAULT 16 CHECK (bracket_size IN (8, 16, 32, 64)),
    max_competitors INTEGER NOT NULL,
    registration_fee DECIMAL(10, 2) DEFAULT 0,
    registration_opens TIMESTAMP,
    registration_closes TIMESTAMP,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')),
    rules TEXT,
    equipment_provided TEXT,
    time_limit_minutes INTEGER DEFAULT 4,
    pattern_type VARCHAR(20) DEFAULT 'free_pour' CHECK (pattern_type IN ('free_pour', 'assigned', 'mixed')),
    organizer_id UUID REFERENCES users(id),
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event competitors (junction table)
CREATE TABLE IF NOT EXISTS event_competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    check_in_status VARCHAR(20) DEFAULT 'registered' CHECK (check_in_status IN ('registered', 'checked_in', 'no_show', 'withdrawn')),
    check_in_time TIMESTAMP,
    competitor_number INTEGER,
    seed_position INTEGER,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'eliminated', 'winner')),
    equipment_preference TEXT,
    milk_preference VARCHAR(50),
    notes TEXT,
    waiver_signed BOOLEAN DEFAULT FALSE,
    waiver_signed_at TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL,
    match_number INTEGER NOT NULL,
    bracket_side VARCHAR(10) CHECK (bracket_side IN ('winners', 'losers', 'final')),
    competitor_a_id UUID REFERENCES event_competitors(id),
    competitor_b_id UUID REFERENCES event_competitors(id),
    winner_id UUID REFERENCES event_competitors(id),
    loser_id UUID REFERENCES event_competitors(id),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    scheduled_time TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    time_limit_seconds INTEGER DEFAULT 240,
    table_number INTEGER DEFAULT 1,
    judge_ids UUID[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, round_number, match_number, bracket_side)
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    judge_id UUID REFERENCES users(id),
    competitor_a_id UUID REFERENCES event_competitors(id),
    competitor_b_id UUID REFERENCES event_competitors(id),
    competitor_a_scores JSONB,
    competitor_b_scores JSONB,
    winner_id UUID REFERENCES event_competitors(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, judge_id)
);

-- Score criteria template
CREATE TABLE IF NOT EXISTS score_criteria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_points INTEGER NOT NULL DEFAULT 10,
    weight DECIMAL(3, 2) DEFAULT 1.0,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    shift_start TIMESTAMP,
    shift_end TIMESTAMP,
    check_in_status VARCHAR(20) DEFAULT 'registered' CHECK (check_in_status IN ('registered', 'checked_in', 'no_show')),
    check_in_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id, role)
);

-- Volunteer roles reference
CREATE TABLE IF NOT EXISTS volunteer_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    responsibilities TEXT[],
    is_active BOOLEAN DEFAULT TRUE
);

-- Photos table
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    match_id UUID REFERENCES matches(id),
    competitor_id UUID REFERENCES event_competitors(id),
    uploader_id UUID REFERENCES users(id),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    type VARCHAR(20) CHECK (type IN ('competitor', 'pour', 'match', 'event', 'award')),
    caption TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event announcements/notifications
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('general', 'match_call', 'result', 'schedule_change', 'emergency')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_by UUID REFERENCES users(id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_audience VARCHAR(20) DEFAULT 'all' CHECK (target_audience IN ('all', 'competitors', 'volunteers', 'organizers'))
);

-- User sessions for authentication
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default volunteer roles
INSERT INTO volunteer_roles (name, description, responsibilities) VALUES
('MC', 'Master of Ceremonies - Hosts the event, introduces competitors, keeps crowd engaged', 
 ARRAY['Welcome and orientation', 'Competitor introductions', 'Match announcements', 'Winner announcements', 'Crowd engagement']),
('Bracket Manager', 'Manages bracket display and updates', 
 ARRAY['Bracket setup', 'Results recording', 'Advancement tracking', 'Display updates']),
('Station Manager', 'Manages competition area and equipment', 
 ARRAY['Equipment setup', 'Station cleaning', 'Supplies restocking', 'Technical troubleshooting']),
('Shot Puller', 'Pulls espresso shots for competitors', 
 ARRAY['Espresso extraction', 'Grinder adjustment', 'Shot timing', 'Quality control']),
('Timekeeper', 'Manages match timing', 
 ARRAY['Match timing', 'Overtime tracking', 'Penalty enforcement', 'Schedule maintenance']),
('Registration Staff', 'Handles competitor check-in', 
 ARRAY['QR code scanning', 'Check-in tracking', 'Walk-on registration', 'Information desk']),
('Runner', 'Transports cups and manages flow', 
 ARRAY['Cup transport', 'Inventory management', 'Cup cleaning', 'Photo coordination']),
('Judge Coordinator', 'Manages judging process', 
 ARRAY['Judge briefing', 'Score collection', 'Results compilation', 'Dispute resolution']),
('Photographer', 'Captures event content', 
 ARRAY['Event photography', 'Social media posting', 'Live updates', 'Content creation']),
('Cleanup Crew', 'Manages venue cleanup', 
 ARRAY['Station cleaning', 'Equipment cleaning', 'Venue restoration'])
ON CONFLICT (name) DO NOTHING;

-- Insert default score criteria template
INSERT INTO score_criteria (event_id, name, description, max_points, weight, display_order) VALUES
(NULL, 'Contrast', 'Definition between milk and espresso', 10, 1.0, 1),
(NULL, 'Symmetry', 'Balance of pattern', 10, 1.0, 2),
(NULL, 'Difficulty', 'Complexity of pattern', 10, 1.0, 3),
(NULL, 'Position', 'Centering in cup', 10, 1.0, 4),
(NULL, 'Foam Quality', 'Silkiness, gloss, texture', 10, 1.0, 5),
(NULL, 'Overall Appeal', 'Holistic impression', 20, 2.0, 6);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_competitors_event ON event_competitors(event_id);
CREATE INDEX IF NOT EXISTS idx_event_competitors_user ON event_competitors(user_id);
CREATE INDEX IF NOT EXISTS idx_event_competitors_checkin ON event_competitors(check_in_status);
CREATE INDEX IF NOT EXISTS idx_matches_event ON matches(event_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_scores_match ON scores(match_id);
CREATE INDEX IF NOT EXISTS idx_volunteers_event ON volunteers(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_event ON photos(event_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scores_updated_at BEFORE UPDATE ON scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
