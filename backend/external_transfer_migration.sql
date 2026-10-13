-- NorthBridge Bank Schema Migration
-- Adding external transfer details columns to transactions table

USE northbridge_bank;

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS external_bank_name VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS external_account_name VARCHAR(100) NULL,
ADD COLUMN IF NOT EXISTS external_account_number VARCHAR(50) NULL;
