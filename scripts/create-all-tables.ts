// Script to create all export tables
import { config } from 'dotenv';
import { Client } from 'pg';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function createAllTables() {
  console.log('ðŸš€ Creating all export tables...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('âœ… Connected to database');
    
    // Create export_assets table
    console.log('ðŸ“‹ Creating export_assets table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS export_assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID NOT NULL REFERENCES export_jobs(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('video', 'thumbnail', 'metadata')),
        variant TEXT NOT NULL,
        storage_path TEXT,
        size_bytes INTEGER NOT NULL,
        checksum TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('âœ… export_assets table created');
    
    // Create brand_kits table
    console.log('ðŸ“‹ Creating brand_kits table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS brand_kits (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        logo_path TEXT,
        logo_position TEXT DEFAULT 'top-right',
        logo_size TEXT DEFAULT 'small',
        primary_color TEXT,
        secondary_color TEXT,
        overlay_filter TEXT,
        thumbnail_overlay_filter TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('âœ… brand_kits table created');
    
    // Create projects table
    console.log('ðŸ“‹ Creating projects table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        default_brand_kit_id UUID REFERENCES brand_kits(id),
        default_formats JSONB,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('âœ… projects table created');
    
    // Create content table
    console.log('ðŸ“‹ Creating content table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS content (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        source_video_path TEXT NOT NULL,
        duration INTEGER,
        file_size_bytes INTEGER,
        resolution TEXT,
        fps INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log('âœ… content table created');
    
    // Update export_jobs table to add missing columns
    console.log('ðŸ“‹ Updating export_jobs table...');
    await client.query(`
      ALTER TABLE export_jobs 
      ADD COLUMN IF NOT EXISTS formats JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS brand_kit_id UUID REFERENCES brand_kits(id),
      ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id),
      ADD COLUMN IF NOT EXISTS content_id UUID REFERENCES content(id),
      ADD COLUMN IF NOT EXISTS source_video_path TEXT,
      ADD COLUMN IF NOT EXISTS storage_bucket TEXT DEFAULT 'source-videos',
      ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS zip_storage_path TEXT,
      ADD COLUMN IF NOT EXISTS zip_size_bytes INTEGER,
      ADD COLUMN IF NOT EXISTS started_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS error TEXT,
      ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS worker_id TEXT,
      ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMP;
    `);
    console.log('âœ… export_jobs table updated');
    
    // Add constraints
    console.log('ðŸ“‹ Adding constraints...');
    await client.query(`
      ALTER TABLE export_jobs 
      ADD CONSTRAINT IF NOT EXISTS check_status 
      CHECK (status IN ('queued', 'processing', 'packaging', 'uploaded', 'ready', 'failed', 'canceled'));
    `);
    console.log('âœ… Constraints added');
    
    // Verify all tables
    console.log('');
    console.log('ðŸ” Verifying all tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('export_jobs', 'export_assets', 'brand_kits', 'projects', 'content')
      ORDER BY table_name;
    `);
    
    console.log('ðŸ“¦ Export tables created:');
    result.rows.forEach(row => {
      console.log(`  âœ… ${row.table_name}`);
    });
    
    console.log('');
    console.log('ðŸŽ‰ All export tables created successfully!');
    
  } catch (error) {
    console.error('âŒ Error:', error);
  } finally {
    await client.end();
  }
}

// Run the creation
createAllTables().catch(console.error);