// Simple test script to create one table
import { config } from 'dotenv';
import { Client } from 'pg';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function createTestTable() {
  console.log('ðŸ§ª Creating test table...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('âœ… Connected to database');
    
    // Create a simple test table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS export_jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    console.log('ðŸ“‹ Creating export_jobs table...');
    await client.query(createTableSQL);
    console.log('âœ… Table created successfully');
    
    // Verify the table was created
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'export_jobs';
    `);
    
    if (result.rows.length > 0) {
      console.log('âœ… Table verified in database');
    } else {
      console.log('âŒ Table not found in database');
    }
    
  } catch (error) {
    console.error('âŒ Error:', error);
  } finally {
    await client.end();
  }
}

// Run the test
createTestTable().catch(console.error);