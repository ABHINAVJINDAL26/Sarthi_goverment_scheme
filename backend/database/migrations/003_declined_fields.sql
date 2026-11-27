-- Migration: 003_declined_fields.sql
-- Description: Remembers which profile fields the user answered with "prefer not to say".
-- Those fields stay NULL (evaluated as UNKNOWN, never as "no"), but a declined required field
-- still counts as answered when deciding whether a profile card is complete.

BEGIN;

ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS declined_fields TEXT[] NOT NULL DEFAULT '{}';

COMMIT;
