-- ==============================================================================
-- SARTHI DATABASE SCHEMA
-- PostgreSQL schema definition for Sarthi backend.
--
-- This file is the full, latest schema. `npm run migrate` applies it to an empty
-- database and marks every file in database/migrations/ as already applied.
-- An existing database gets only the migrations it has not run yet.
-- When you change the schema: add a new numbered migration AND update this file.
--
-- Profile fields: every field that a scheme rule reads (public/data/schemes.json,
-- "criteria") has a column here; backend/src/eligibility/profileFacts.js maps
-- columns to rule fields and its test fails if a rule field has no column.
-- NULL always means "not answered / prefer not to say" and is evaluated as
-- UNKNOWN, never as "no" (PRD FR-2.5, FR-2.9).
-- ==============================================================================

-- 0. MIGRATION LOG
CREATE TABLE IF NOT EXISTS schema_migrations (
    filename VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. USERS TABLE
-- Core identity table for mobile-based OTP authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mobile_number VARCHAR(10) UNIQUE NOT NULL,
    mobile_verified_at TIMESTAMPTZ,
    preferred_language VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_mobile_number
        CHECK (mobile_number ~ '^[6-9][0-9]{9}$')
);

-- 2. USER PROFILES TABLE
-- 1-to-1 profile record holding all card data
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id BIGINT PRIMARY KEY
        REFERENCES users(id) ON DELETE CASCADE,

    -- Card 1: Personal Information
    full_name VARCHAR(150),
    date_of_birth DATE,
    gender VARCHAR(30),

    -- Card 2: Location Information
    state VARCHAR(100),
    district VARCHAR(100),
    residence_type VARCHAR(20),
    has_pucca_house BOOLEAN,              -- PMAY-G, PMAY-U 2.0
    owns_house BOOLEAN,                   -- PM Surya Ghar
    has_electricity_connection BOOLEAN,   -- PM Surya Ghar

    -- Card 3: Education Information
    education_level VARCHAR(100),
    is_student BOOLEAN,
    current_class SMALLINT,               -- 1-12 while in school; NMMSS, Post Matric

    -- Card 4: Employment Information
    occupation VARCHAR(100),
    govt_employee_in_family BOOLEAN,      -- PM-KISAN, PM Vishwakarma exclusions
    epfo_esic_nps_member BOOLEAN,         -- PM-SYM exclusion

    -- Card 5: Income Information
    annual_household_income NUMERIC(12, 2),
    monthly_personal_income NUMERIC(12, 2),  -- PM-SYM, ADIP limits are per month
    income_tax_payer BOOLEAN,             -- PM-KISAN, APY, PM-SYM exclusions
    has_bank_account BOOLEAN,             -- DBT schemes, PMJJBY, PMSBY, APY
    land_holding_acres NUMERIC(10, 2),

    -- Card 6: Social Category Information
    social_category VARCHAR(50),
    minority_status BOOLEAN,
    disability_status BOOLEAN,
    disability_percent SMALLINT,          -- ADIP 40%+, Punjab 50%+, IGNDPS
    bpl_card BOOLEAN,
    ration_card_type VARCHAR(20),         -- PMGKAY (AAY / PHH)
    in_secc_list BOOLEAN,                 -- PM-JAY, PMAY-G beneficiary lists

    -- Card 7: Family Information
    marital_status VARCHAR(30),
    family_size INTEGER,
    pregnant_or_lactating BOOLEAN,        -- JSY, PMMVY

    -- Fields answered with "prefer not to say" (stored as NULL above)
    declined_fields TEXT[] NOT NULL DEFAULT '{}',

    -- Final Submission Workflow
    is_submitted BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_date_of_birth CHECK (
        date_of_birth IS NULL
        OR date_of_birth <= CURRENT_DATE
    ),
    CONSTRAINT chk_annual_income CHECK (
        annual_household_income IS NULL
        OR annual_household_income >= 0
    ),
    CONSTRAINT chk_monthly_income CHECK (
        monthly_personal_income IS NULL
        OR monthly_personal_income >= 0
    ),
    CONSTRAINT chk_land_holding CHECK (
        land_holding_acres IS NULL
        OR land_holding_acres >= 0
    ),
    CONSTRAINT chk_family_size CHECK (
        family_size IS NULL
        OR family_size >= 1
    ),
    CONSTRAINT chk_residence_type CHECK (
        residence_type IS NULL
        OR residence_type IN ('rural', 'urban')
    ),
    CONSTRAINT chk_gender CHECK (
        gender IS NULL
        OR gender IN ('female', 'male', 'transgender')
    ),
    CONSTRAINT chk_social_category CHECK (
        social_category IS NULL
        OR social_category IN ('General', 'OBC', 'SC', 'ST', 'EWS')
    ),
    CONSTRAINT chk_marital_status CHECK (
        marital_status IS NULL
        OR marital_status IN ('unmarried', 'married', 'widow', 'divorced', 'separated', 'destitute')
    ),
    CONSTRAINT chk_occupation CHECK (
        occupation IS NULL
        OR occupation IN (
            'farmer', 'student', 'entrepreneur', 'artisan', 'street_vendor',
            'unorganised_worker', 'construction_worker', 'salaried', 'unemployed',
            'homemaker', 'retired', 'other'
        )
    ),
    CONSTRAINT chk_ration_card_type CHECK (
        ration_card_type IS NULL
        OR ration_card_type IN ('AAY', 'PHH', 'NON_NFSA', 'NONE')
    ),
    CONSTRAINT chk_disability_percent CHECK (
        disability_percent IS NULL
        OR disability_percent BETWEEN 0 AND 100
    ),
    CONSTRAINT chk_current_class CHECK (
        current_class IS NULL
        OR current_class BETWEEN 1 AND 12
    )
);

-- 3. PROFILE PROGRESS TABLE
-- Independent section progress tracking for every profile card
CREATE TABLE IF NOT EXISTS profile_progress (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    section_key VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started',
    last_saved_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,

    UNIQUE (user_id, section_key),

    CONSTRAINT profile_progress_section_key_check CHECK (
        section_key IN (
            'basics',
            'location',
            'education',
            'employment',
            'income',
            'social_category',
            'family'
        )
    ),
    CONSTRAINT profile_progress_status_check CHECK (
        status IN ('not_started', 'in_progress', 'completed')
    )
);

-- 4. USER CONSENTS TABLE
-- Audit log for user consents and declarations
CREATE TABLE IF NOT EXISTS user_consents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    purpose VARCHAR(50) NOT NULL,
    consent_version VARCHAR(30) NOT NULL,
    granted BOOLEAN NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profile_progress_user
    ON profile_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_user_consents_user
    ON user_consents(user_id);

CREATE INDEX IF NOT EXISTS idx_user_profiles_submission
    ON user_profiles(is_submitted);
