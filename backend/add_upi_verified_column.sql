-- Migration: Add upi_verified column to users table
-- Run this in Supabase SQL Editor

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS upi_verified BOOLEAN DEFAULT FALSE;
