-- Enable RLS (Row Level Security)
alter table users enable row level security;
alter table events enable row level security;
alter table competitors enable row level security;
alter table heats enable row level security;
alter table votes enable row level security;
alter table photos enable row level security;
alter table public_votes enable row level security;
alter table sponsors enable row level security;
alter table brackets enable row level security;
alter table judge_assignments enable row level security;

-- Create enum types
CREATE TYPE user_role AS ENUM (
  'EVENT_DIRECTOR',
  'SPONSOR_TIER_1',
  'SPONSOR_TIER_2',
  'SPONSOR_TIER_3',
  'HOST',
  'CO_HOST',
  'STATION_MANAGER',
  'RESET_CREW',
  'VOLUNTEER',
  'VISUAL_JUDGE',
  'GENERAL_MEMBER',
  'COMPETITOR',
  'COACH',
  'COMPETITOR_ASSISTANT',
  'EMCEE'
);

CREATE TYPE event_format AS ENUM ('MATCH_PATTERN', 'FREESTYLE');
CREATE TYPE heat_status AS ENUM ('SCHEDULED', 'PRACTICE', 'SERVICE', 'CLEANUP', 'COMPLETED');
CREATE TYPE vote_choice AS ENUM ('LEFT', 'RIGHT');
CREATE TYPE sponsor_tier AS ENUM ('BROUGHT_TO_YOU_BY', 'PARTNERED_WITH', 'SUPPORTED_BY');

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profiles', 'profiles', true);

-- Create storage bucket for event photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id IN ('profiles', 'photos'));

CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    bucket_id IN ('profiles', 'photos')
  );

-- Function to generate single elimination bracket
CREATE OR REPLACE FUNCTION generate_bracket(event_id UUID)
RETURNS VOID AS $$
DECLARE
  competitors_arr UUID[];
  num_competitors INT;
  num_rounds INT;
  round_num INT;
  match_position INT;
  i INT;
BEGIN
  -- Get all competitors for the event
  SELECT ARRAY_AGG(id), COUNT(*)
  INTO competitors_arr, num_competitors
  FROM competitors
  WHERE competitors.event_id = event_id;
  
  IF num_competitors < 2 THEN
    RAISE EXCEPTION 'Need at least 2 competitors';
  END IF;
  
  -- Calculate number of rounds needed
  num_rounds := CEIL(LOG(2, num_competitors))::INT;
  
  -- Create first round matches
  round_num := 1;
  match_position := 1;
  
  FOR i IN 1..(num_competitors / 2) LOOP
    INSERT INTO heats (
      event_id,
      competitor_a_id,
      competitor_b_id,
      round,
      position,
      status
    ) VALUES (
      event_id,
      competitors_arr[(i-1)*2 + 1],
      competitors_arr[(i-1)*2 + 2],
      round_num,
      match_position,
      'SCHEDULED'
    );
    
    match_position := match_position + 1;
  END LOOP;
  
  -- If odd number, one gets a bye
  IF num_competitors % 2 = 1 THEN
    INSERT INTO heats (
      event_id,
      competitor_a_id,
      round,
      position,
      status
    ) VALUES (
      event_id,
      competitors_arr[num_competitors],
      round_num,
      match_position,
      'SCHEDULED'
    );
  END IF;
  
  -- Create empty heats for subsequent rounds
  FOR round_num IN 2..num_rounds LOOP
    FOR match_position IN 1..(2^(num_rounds - round_num)) LOOP
      INSERT INTO heats (
        event_id,
        round,
        position,
        status
      ) VALUES (
        event_id,
        round_num,
        match_position,
        'SCHEDULED'
      );
    END LOOP;
  END LOOP;
  
  -- Link heats together (next round progression)
  -- This is simplified - you'd want more complex logic here
END;
$$ LANGUAGE plpgsql;
