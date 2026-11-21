-- ==============================================================================
-- SARTHI DATABASE SCHEMA
-- PostgreSQL schema definition for Sarthi backend
-- ==============================================================================

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

    -- Card 3: Education Information
    education_level VARCHAR(100),

    -- Card 4: Employment Information
    occupation VARCHAR(100),

    -- Card 5: Income Information
    annual_household_income NUMERIC(12, 2),
    land_holding_acres NUMERIC(10, 2),

    -- Card 6: Social Category Information
    social_category VARCHAR(50),
    minority_status BOOLEAN,
    disability_status BOOLEAN,
    bpl_card BOOLEAN,

    -- Card 7: Family Information
    marital_status VARCHAR(30),
    family_size INTEGER,

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
