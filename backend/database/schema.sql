-- BPI Kalasag: PostgreSQL Database Schema
-- Version: 2.0 
-- Date: July 30, 2025
-- Author: Julia
-- Description: This schema is for a self-contained prototype and includes critical improvements
-- for data integrity, security, and performance.

-- --- Initial Setup ---
-- Enable the pgcrypto extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --- Table: users ---
-- Stores profile information for all individuals (seniors and guardians).
-- Note: The role of a user is determined by relationships, not a fixed type.
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE, -- Added for standard identification
    age_group VARCHAR(10), -- e.g., '60-69', '70-79'
    is_kalasag_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --- Table: accounts ---
-- The "vault" that holds the monetary balance for each user.
CREATE TABLE accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    account_number VARCHAR(255) NOT NULL UNIQUE,
    -- Using DECIMAL(19, 4) for financial precision.
    balance DECIMAL(19, 4) NOT NULL CHECK (balance >= 0),
    account_type VARCHAR(50) NOT NULL DEFAULT 'savings',
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- e.g., 'active', 'frozen'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --- Table: guardians ---
-- Links a senior user to their trusted guardian.
CREATE TABLE guardians (
    guardian_relationship_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    guardian_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'revoked'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    activated_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (senior_user_id, guardian_user_id)
);

-- --- Table: guardian_permissions ---
-- Defines the specific safety net rules for each guardian relationship.
CREATE TABLE guardian_permissions (
    permission_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_relationship_id UUID NOT NULL REFERENCES guardians(guardian_relationship_id) ON DELETE CASCADE,
    alert_on_amount_greater_than DECIMAL(19, 4) DEFAULT 5000.00,
    alert_on_new_payee BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --- Table: transactions ---
-- The immutable ledger that records all movements of money between accounts.
CREATE TABLE transactions (
    transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_account_id UUID NOT NULL REFERENCES accounts(account_id) ON DELETE RESTRICT,
    destination_account_id UUID REFERENCES accounts(account_id) ON DELETE RESTRICT,
    amount DECIMAL(19, 4) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'transfer', 'bill_payment'
    status VARCHAR(50) NOT NULL, -- 'completed', 'pending_review', 'failed', 'cancelled'
    is_flagged_as_high_risk BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --- Table: alerts ---
-- A critical audit trail of all notifications sent to guardians.
CREATE TABLE alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guardian_relationship_id UUID NOT NULL REFERENCES guardians(guardian_relationship_id) ON DELETE RESTRICT,
    transaction_id UUID NOT NULL REFERENCES transactions(transaction_id) ON DELETE RESTRICT,
    alert_type VARCHAR(50) NOT NULL, -- 'high_amount', 'new_payee'
    notification_method VARCHAR(50) NOT NULL DEFAULT 'sms',
    status VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'failed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- --- Indexes for Performance ---
-- Adding indexes to all foreign key columns is critical for query performance.
CREATE INDEX idx_accounts_owner_user_id ON accounts(owner_user_id);
CREATE INDEX idx_guardians_senior_user_id ON guardians(senior_user_id);
CREATE INDEX idx_guardians_guardian_user_id ON guardians(guardian_user_id);
CREATE INDEX idx_guardian_permissions_guardian_relationship_id ON guardian_permissions(guardian_relationship_id);
CREATE INDEX idx_transactions_source_account_id ON transactions(source_account_id);
CREATE INDEX idx_transactions_destination_account_id ON transactions(destination_account_id);
CREATE INDEX idx_alerts_guardian_relationship_id ON alerts(guardian_relationship_id);
CREATE INDEX idx_alerts_transaction_id ON alerts(transaction_id);


-- --- Trigger for auto-updating timestamps ---
-- This function automatically updates the 'updated_at' column on any row change.
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with an 'updated_at' column
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON accounts
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON guardians
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON guardian_permissions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();