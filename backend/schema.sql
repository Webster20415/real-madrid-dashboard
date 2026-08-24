-- Disable auto-commit wrapped database creation issues
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL DEFAULT 'Sports',
    venue VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Upcoming', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Real Madrid Fixtures & Events
INSERT INTO events (title, description, category, venue, organizer, event_date, status)
VALUES 
('Real Madrid vs Barcelona (El Clásico)', 'La Liga matchday at the Bernabéu.', 'Sports', 'Santiago Bernabéu Stadium', 'La Liga', '2026-10-25 21:00:00+00', 'Upcoming'),
('First Team Open Training Session', 'First-team training session open to club members.', 'Sports', 'Ciudad Real Madrid, Valdebebas', 'Real Madrid C.F.', '2026-09-01 10:00:00+00', 'Upcoming'),
('Pre-Season Press Conference', 'Manager addresses the media prior to European campaign.', 'Business', 'Press Room, Valdebebas', 'Media Relations', '2026-08-15 12:00:00+00', 'Completed'),
('Cyber Stadium Tech Keynote', 'Unveiling the next-gen retractable roof tech.', 'Technology', 'Bernabéu Innovation Hub', 'Real Madrid Next', '2026-11-05 15:00:00+00', 'Upcoming');