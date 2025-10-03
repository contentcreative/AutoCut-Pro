// Script to verify export tables in Supabase
import { config } from 'dotenv';
import { Client } from 'pg';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function verifyTables() {
  console.log('ðŸ” Verifying export tables in Supabase...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('âœ… Connected to database');
    
    // Check what tables exist
    const result = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('ðŸ“¦ All tables in database:');
    result.rows.forEach(row => {
      console.log(`  ${row.table_name} (${row.table_type})`);
    });
    
    // Check specifically for our export tables
    const exportTables = ['export_jobs', 'export_assets', 'brand_kits', 'projects', 'content'];
    const existingTables = result.rows.map(row => row.table_name);
    
    console.log('');
    console.log('ðŸŽ¯ Export tables status:');
    exportTables.forEach(tableName => {
      if (existingTables.includes(tableName)) {
        console.log(`  âœ… ${tableName} - exists`);
      } else {
        console.log(`  âŒ ${tableName} - missing`);
      }
    });
    
  } catch (error) {
    console.error('âŒ Verification failed:', error);
  } finally {
    await client.end();
  }
}

// Run the verification
verifyTables().catch(console.error);