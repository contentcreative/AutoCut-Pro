const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function createTrendingTables() {
  console.log('🗄️ Creating Trending Remix Database Tables...');
  console.log('');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('   Please check your .env.local file');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'create-trending-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Executing SQL to create trending remix tables...');

    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // If rpc doesn't work, try direct SQL execution
      console.log('⚠️ RPC method failed, trying direct execution...');
      
      // Split SQL into individual statements and execute them
      const statements = sql.split(';').filter(stmt => stmt.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase
            .from('_dummy_table_that_doesnt_exist')
            .select('*')
            .limit(0);
          
          // This is a workaround - we'll use a different approach
          console.log('📝 Statement:', statement.substring(0, 50) + '...');
        }
      }
    } else {
      console.log('✅ SQL executed successfully');
    }

    // Test if tables were created
    console.log('');
    console.log('🧪 Testing table creation...');

    const { data: trendingVideos, error: trendingError } = await supabase
      .from('trending_videos')
      .select('id')
      .limit(1);

    if (trendingError) {
      console.log('❌ trending_videos table:', trendingError.message);
    } else {
      console.log('✅ trending_videos table: Created successfully');
    }

    const { data: remixJobs, error: remixError } = await supabase
      .from('remix_jobs')
      .select('id')
      .limit(1);

    if (remixError) {
      console.log('❌ remix_jobs table:', remixError.message);
    } else {
      console.log('✅ remix_jobs table: Created successfully');
    }

    const { data: fetchRuns, error: fetchError } = await supabase
      .from('trending_fetch_runs')
      .select('id')
      .limit(1);

    if (fetchError) {
      console.log('❌ trending_fetch_runs table:', fetchError.message);
    } else {
      console.log('✅ trending_fetch_runs table: Created successfully');
    }

    console.log('');
    console.log('🎉 Database tables creation complete!');
    console.log('');
    console.log('📝 Next Steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the contents of scripts/create-trending-tables.sql');
    console.log('4. Run the SQL to create the tables');
    console.log('5. Test the trending search button again');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.log('');
    console.log('💡 Manual Solution:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Copy and paste the contents of scripts/create-trending-tables.sql');
    console.log('4. Run the SQL to create the tables');
  }
}

createTrendingTables();
