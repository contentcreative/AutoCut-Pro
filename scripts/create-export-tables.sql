-- Create Export Tables for AutoCut Pro
-- Run this script to create the required tables for the video export system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Export Jobs Table
CREATE TABLE IF NOT EXISTS export_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    project_id UUID, -- Optional: link to a project
    content_id UUID, -- Optional: link to specific content
    
    -- Job Configuration
    formats JSONB NOT NULL, -- Array of format objects
    options JSONB DEFAULT '{}', -- Export options
    brand_kit_id UUID, -- Optional: link to brand kit for overlays
    
    -- Source Video
    source_video_path TEXT NOT NULL, -- Path in Supabase Storage
    storage_bucket TEXT DEFAULT 'source-videos', -- Source bucket name
    
    -- Job Status & Progress
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'packaging', 'uploaded', 'ready', 'failed', 'canceled')),
    progress INTEGER NOT NULL DEFAULT 0, -- 0-100 percentage
    
    -- Output
    zip_storage_path TEXT, -- Path to final ZIP in exports bucket
    zip_size_bytes INTEGER, -- Size of final ZIP file
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Error Handling
    error TEXT, -- Error message if job failed
    retry_count INTEGER DEFAULT 0, -- Number of retry attempts
    
    -- Worker Info
    worker_id TEXT, -- ID of worker processing this job
    processing_started_at TIMESTAMP
);

-- Export Assets Table
CREATE TABLE IF NOT EXISTS export_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES export_jobs(id) ON DELETE CASCADE,
    
    -- Asset Info
    type TEXT NOT NULL CHECK (type IN ('video', 'thumbnail', 'metadata')),
    variant TEXT NOT NULL, -- e.g., "9x16", "9x16-thumb", "title.txt"
    
    -- File Info
    storage_path TEXT, -- Path in storage (or "N/A (packed in zip)")
    size_bytes INTEGER NOT NULL,
    checksum TEXT NOT NULL, -- MD5 hash for integrity verification
    
    -- Metadata
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Brand Kits Table
CREATE TABLE IF NOT EXISTS brand_kits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    name TEXT NOT NULL,
    description TEXT,
    
    -- Brand Assets
    logo_path TEXT, -- Path to logo in brand-assets bucket
    logo_position TEXT DEFAULT 'top-right', -- Position for overlay
    logo_size TEXT DEFAULT 'small', -- small, medium, large
    
    -- Colors
    primary_color TEXT,
    secondary_color TEXT,
    
    -- FFmpeg Filters (computed from assets)
    overlay_filter TEXT, -- e.g., "overlay=10:10"
    thumbnail_overlay_filter TEXT, -- e.g., "overlay=5:5"
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    name TEXT NOT NULL,
    description TEXT,
    
    -- Project Settings
    default_brand_kit_id UUID REFERENCES brand_kits(id),
    default_formats JSONB, -- Default export formats for this project
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Content Table
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- Clerk user ID
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Content Info
    title TEXT NOT NULL,
    description TEXT,
    source_video_path TEXT NOT NULL, -- Path in source-videos bucket
    
    -- Metadata
    duration INTEGER, -- Duration in seconds
    file_size_bytes INTEGER,
    resolution TEXT, -- e.g., "1920x1080"
    fps INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);