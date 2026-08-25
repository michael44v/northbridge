-- NorthBridge Bank Schema Migration
-- Adding extended user profile and account configuration columns

USE northbridge_bank;

ALTER TABLE users
ADD COLUMN profile_picture LONGTEXT NULL,
ADD COLUMN state VARCHAR(100) NULL,
ADD COLUMN zipcode VARCHAR(20) NULL,
ADD COLUMN occupation VARCHAR(150) NULL,
ADD COLUMN dob VARCHAR(20) NULL,
ADD COLUMN sex VARCHAR(20) NULL;

ALTER TABLE accounts
ADD COLUMN swift_code VARCHAR(20) DEFAULT 'STRCGB2L',
ADD COLUMN routing_code VARCHAR(20) DEFAULT '10-20-30',
ADD COLUMN transfer_limit DECIMAL(15, 2) DEFAULT 200000.00,
ADD COLUMN account_type VARCHAR(50) DEFAULT 'Savings Account';
