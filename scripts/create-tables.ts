// Script to create export tables in Supabase using direct postgres connection
import { config } from 'dotenv';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function createExportTables() {
  console.log('ðŸš€ Creating export tables in Supabase...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('âœ… Connected to database');
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'scripts', 'create-export-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('ðŸ“‹ Executing SQL script...');
    
    // Split into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          await client.query(statement);
          console.log('âœ… Statement executed successfully');
        } catch (err: any) {
          if (err.message.includes('already exists')) {
            console.log('âš ï¸ Table/object already exists, skipping...');
          } else {
            console.error(`âŒ Error executing statement:`, err.message);
          }
        }
      }
    }
    
    // Verify tables were created
    console.log('');
    console.log('ðŸ” Verifying tables...');
    
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('export_jobs', 'export_assets', 'brand_kits', 'projects', 'content')
      ORDER BY table_name;
    `);
    
    console.log('ðŸ“¦ Tables found:');
    result.rows.forEach(row => {
      console.log(`  âœ… ${row.table_name}`);
    });
    
    console.log('');
    console.log('ðŸŽ‰ Export tables setup complete!');
    console.log('');
    console.log('ðŸ“‹ Next steps:');
    console.log('1. Verify tables in Supabase dashboard > Table Editor');
    console.log('2. Test the export functionality');
    console.log('3. Create some sample data');
    
  } catch (error) {
    console.error('âŒ Setup failed:', error);
  } finally {
    await client.end();
  }
}

// Run the setup
createExportTables().catch(console.error);