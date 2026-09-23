-- Migration to add swap_protocol_required column to users table
USE northbridge_bank;

ALTER TABLE users
ADD COLUMN swap_protocol_required TINYINT DEFAULT 0;
