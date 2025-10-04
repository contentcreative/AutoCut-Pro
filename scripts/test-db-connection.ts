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

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  console.log('URL:', supabaseUrl?.substring(0, 50) + '...');
  console.log('Key:', supabaseKey?.substring(0, 20) + '...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('⚠️ Error querying profiles table:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase');
      console.log('📊 Profiles table accessible');
    }
    
    // Try to create a test table
    console.log('\n🧪 Testing table creation...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS test_table (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name text NOT NULL,
          created_at timestamp with time zone DEFAULT now()
        );
      `
    });
    
    if (createError) {
      console.log('⚠️ Cannot create tables via RPC:', createError.message);
      console.log('💡 This is expected - we need to use Drizzle migrations');
    } else {
      console.log('✅ Table creation via RPC works');
      
      // Clean up test table
      await supabase.rpc('exec_sql', {
        sql: 'DROP TABLE IF EXISTS test_table;'
      });
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error);
  }
}

testConnection();
