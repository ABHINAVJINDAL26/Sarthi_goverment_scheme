-- Migration: 002_profile_fields_for_schemes.sql
-- Description: Adds the profile fields that scheme rules need (public/data/schemes.json
-- "criteria") and fixes the allowed values of existing text fields.
-- NULL = not answered / prefer not to say (evaluated as UNKNOWN, never as "no").
--
-- The value checks are added NOT VALID: they apply to every new or updated row,
-- but rows saved before this migration are not rejected. Clean old rows, then run
--   ALTER TABLE user_profiles VALIDATE CONSTRAINT <name>;

BEGIN;

-- Location: housing and electricity (PMAY-G, PMAY-U 2.0, PM Surya Ghar)
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS has_pucca_house BOOLEAN,
    ADD COLUMN IF NOT EXISTS owns_house BOOLEAN,
    ADD COLUMN IF NOT EXISTS has_electricity_connection BOOLEAN;

-- Education: student status and class (NMMSS, Post Matric scholarships)
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS is_student BOOLEAN,
    ADD COLUMN IF NOT EXISTS current_class SMALLINT;

-- Employment: exclusions used by PM-KISAN, PM Vishwakarma, PM-SYM
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS govt_employee_in_family BOOLEAN,
    ADD COLUMN IF NOT EXISTS epfo_esic_nps_member BOOLEAN;

-- Income: monthly limits, tax status, bank account (PM-SYM, ADIP, APY, PMJJBY, PMSBY)
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS monthly_personal_income NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS income_tax_payer BOOLEAN,
    ADD COLUMN IF NOT EXISTS has_bank_account BOOLEAN;

-- Social category: disability %, ration card, beneficiary lists (ADIP, PMGKAY, PM-JAY)
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS disability_percent SMALLINT,
    ADD COLUMN IF NOT EXISTS ration_card_type VARCHAR(20),
    ADD COLUMN IF NOT EXISTS in_secc_list BOOLEAN;

-- Family: pregnancy / breastfeeding (JSY, PMMVY)
ALTER TABLE user_profiles
    ADD COLUMN IF NOT EXISTS pregnant_or_lactating BOOLEAN;

-- Normalise casing of values saved before this migration
UPDATE user_profiles SET gender = LOWER(gender) WHERE gender IS NOT NULL;
UPDATE user_profiles SET residence_type = LOWER(residence_type) WHERE residence_type IS NOT NULL;
UPDATE user_profiles SET marital_status = LOWER(marital_status) WHERE marital_status IS NOT NULL;
UPDATE user_profiles SET occupation = LOWER(occupation) WHERE occupation IS NOT NULL;
UPDATE user_profiles
    SET social_category = CASE
        WHEN LOWER(social_category) = 'general' THEN 'General'
        ELSE UPPER(social_category)
    END
    WHERE social_category IS NOT NULL;

ALTER TABLE user_profiles
    DROP CONSTRAINT IF EXISTS chk_monthly_income,
    DROP CONSTRAINT IF EXISTS chk_gender,
    DROP CONSTRAINT IF EXISTS chk_social_category,
    DROP CONSTRAINT IF EXISTS chk_marital_status,
    DROP CONSTRAINT IF EXISTS chk_occupation,
    DROP CONSTRAINT IF EXISTS chk_ration_card_type,
    DROP CONSTRAINT IF EXISTS chk_disability_percent,
    DROP CONSTRAINT IF EXISTS chk_current_class;

ALTER TABLE user_profiles
    ADD CONSTRAINT chk_monthly_income CHECK (
        monthly_personal_income IS NULL OR monthly_personal_income >= 0
    ) NOT VALID,
    ADD CONSTRAINT chk_gender CHECK (
        gender IS NULL OR gender IN ('female', 'male', 'transgender')
    ) NOT VALID,
    ADD CONSTRAINT chk_social_category CHECK (
        social_category IS NULL OR social_category IN ('General', 'OBC', 'SC', 'ST', 'EWS')
    ) NOT VALID,
    ADD CONSTRAINT chk_marital_status CHECK (
        marital_status IS NULL
        OR marital_status IN ('unmarried', 'married', 'widow', 'divorced', 'separated', 'destitute')
    ) NOT VALID,
    ADD CONSTRAINT chk_occupation CHECK (
        occupation IS NULL
        OR occupation IN (
            'farmer', 'student', 'entrepreneur', 'artisan', 'street_vendor',
            'unorganised_worker', 'construction_worker', 'salaried', 'unemployed',
            'homemaker', 'retired', 'other'
        )
    ) NOT VALID,
    ADD CONSTRAINT chk_ration_card_type CHECK (
        ration_card_type IS NULL OR ration_card_type IN ('AAY', 'PHH', 'NON_NFSA', 'NONE')
    ) NOT VALID,
    ADD CONSTRAINT chk_disability_percent CHECK (
        disability_percent IS NULL OR disability_percent BETWEEN 0 AND 100
    ) NOT VALID,
    ADD CONSTRAINT chk_current_class CHECK (
        current_class IS NULL OR current_class BETWEEN 1 AND 12
    ) NOT VALID;

COMMIT;
