import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking existing tables in Supabase...');
  
  try {
    // Check existing tables
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');
    
    if (error) {
      console.error('❌ Error checking tables:', error);
      return;
    }
    
    console.log('📋 Existing tables:');
    tables?.forEach(table => console.log('  ✅', table.table_name));
    
    // Check if our new tables exist
    const expectedTables = ['ai_video_projects', 'ai_generation_jobs', 'ai_assets'];
    const existingTableNames = tables?.map(t => t.table_name) || [];
    
    console.log('\n🔍 Checking for AI Video tables:');
    expectedTables.forEach(tableName => {
      if (existingTableNames.includes(tableName)) {
        console.log(`  ✅ ${tableName} - EXISTS`);
      } else {
        console.log(`  ❌ ${tableName} - MISSING`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTables();
