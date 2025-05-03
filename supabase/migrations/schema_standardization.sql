-- Schema Standardization Migration
-- This file documents the recommended changes to standardize the database schema
-- Execute these statements in your Supabase SQL editor or through migrations

-- 1. Rename tables with spaces to use snake_case
ALTER TABLE IF EXISTS "Maid Attendance" RENAME TO maid_attendance;
ALTER TABLE IF EXISTS "Night Patrol Beat" RENAME TO night_patrol_beat;

-- 2. Consolidate duplicate tables
-- First, migrate any data from Guard to Guards if needed
-- INSERT INTO "Guards" (id, created_at)
-- SELECT id, created_at FROM "Guard" WHERE id NOT IN (SELECT id FROM "Guards");
-- Then drop the duplicate table
DROP TABLE IF EXISTS "Guard";

-- 3. Rename columns with spaces to use snake_case
ALTER TABLE IF EXISTS "Maids" RENAME COLUMN "Name of Maid" TO name_of_maid;
ALTER TABLE IF EXISTS "Maids" RENAME COLUMN "Face Descriptor" TO face_descriptor;

-- Note: After applying these changes, update your application code to use the new table and column names
-- This includes updating queries in use-auth.tsx and other files that interact with the database
