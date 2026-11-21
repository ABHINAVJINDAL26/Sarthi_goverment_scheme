-- Migration: 001_update_sections_and_submission.sql
-- Description: Updates profile_progress section keys to match approved 7 cards and adds submission fields to user_profiles

BEGIN;

-- 1. Add submission tracking columns to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_submitted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;

-- 2. Drop the existing section_key check constraint temporarily
ALTER TABLE profile_progress
DROP CONSTRAINT IF EXISTS profile_progress_section_key_check;

-- 3. Migrate 'category' to 'social_category'
UPDATE profile_progress
SET section_key = 'social_category'
WHERE section_key = 'category';

-- 4. Migrate 'income_occupation' into separate 'income' and 'employment' records
INSERT INTO profile_progress (user_id, section_key, status, last_saved_at, completed_at)
SELECT user_id, 'income', status, last_saved_at, completed_at
FROM profile_progress
WHERE section_key = 'income_occupation'
ON CONFLICT (user_id, section_key) DO UPDATE SET
    status = EXCLUDED.status,
    last_saved_at = EXCLUDED.last_saved_at,
    completed_at = EXCLUDED.completed_at;

INSERT INTO profile_progress (user_id, section_key, status, last_saved_at, completed_at)
SELECT user_id, 'employment', status, last_saved_at, completed_at
FROM profile_progress
WHERE section_key = 'income_occupation'
ON CONFLICT (user_id, section_key) DO UPDATE SET
    status = EXCLUDED.status,
    last_saved_at = EXCLUDED.last_saved_at,
    completed_at = EXCLUDED.completed_at;

DELETE FROM profile_progress
WHERE section_key = 'income_occupation';

-- 5. Ensure all 7 sections exist for all existing users
INSERT INTO profile_progress (user_id, section_key, status)
SELECT u.id, s.section_key, 'not_started'
FROM users u
CROSS JOIN (
    VALUES
        ('basics'),
        ('location'),
        ('education'),
        ('employment'),
        ('income'),
        ('social_category'),
        ('family')
) AS s(section_key)
ON CONFLICT (user_id, section_key) DO NOTHING;

-- 6. Re-add the updated check constraint for the 7 approved sections
ALTER TABLE profile_progress
ADD CONSTRAINT profile_progress_section_key_check
CHECK (
    section_key IN (
        'basics',
        'location',
        'education',
        'employment',
        'income',
        'social_category',
        'family'
    )
);

-- 7. Add index for quick lookup of submission status
CREATE INDEX IF NOT EXISTS idx_user_profiles_submission
ON user_profiles(is_submitted);

COMMIT;
