import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAIVideoTables() {
  console.log('🚀 Creating AI Video tables in Supabase...');
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'db/migrations/0008_ai_video_features.sql');
    const sqlScript = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('✅ Connected to database');
    console.log('📝 Executing SQL script...');
    
    // Split the SQL script into individual statements
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec', { sql: statement + ';' });
        if (error) {
          console.warn(`⚠️ Warning for statement: ${error.message}`);
          // Continue with other statements
        }
      }
    }
    
    console.log('✅ AI Video tables creation attempted!');
    console.log('🔍 Please check Supabase dashboard to verify tables were created');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createAIVideoTables();
