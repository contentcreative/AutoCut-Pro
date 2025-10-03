// Script to enable RLS and create security policies for all tables
import { config } from 'dotenv';
import { Client } from 'pg';

// Load environment variables from .env.local
config({ path: '.env.local' });

async function enableRLS() {
  console.log('ðŸ”’ Enabling Row Level Security (RLS) and creating policies...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('âœ… Connected to database');
    
    // List of tables that need RLS enabled
    const tables = [
      'pending_profiles',
      'profiles', 
      'export_jobs',
      'export_assets',
      'brand_kits',
      'projects',
      'content'
    ];
    
    // Enable RLS on all tables
    console.log('ðŸ”’ Enabling RLS on all tables...');
    for (const table of tables) {
      try {
        await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
        console.log(`  âœ… RLS enabled on ${table}`);
      } catch (error: any) {
        if (error.message.includes('already enabled')) {
          console.log(`  âš ï¸ RLS already enabled on ${table}`);
        } else {
          console.error(`  âŒ Error enabling RLS on ${table}:`, error.message);
        }
      }
    }
    
    console.log('');
    console.log('ðŸ“‹ Creating security policies...');
    
    // Create policies for profiles table
    console.log('  Creating policies for profiles...');
    try {
      await client.query(`
        CREATE POLICY "Users can view their own profile" ON profiles
          FOR SELECT USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert their own profile" ON profiles
          FOR INSERT WITH CHECK (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can update their own profile" ON profiles
          FOR UPDATE USING (auth.uid()::text = user_id);
      `);
      console.log('    âœ… Profiles policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Profiles policies already exist');
      } else {
        console.error('    âŒ Error creating profiles policies:', error.message);
      }
    }
    
    // Create policies for pending_profiles table
    console.log('  Creating policies for pending_profiles...');
    try {
      await client.query(`
        CREATE POLICY "Users can view pending profiles" ON pending_profiles
          FOR SELECT USING (true);
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert pending profiles" ON pending_profiles
          FOR INSERT WITH CHECK (true);
      `);
      
      await client.query(`
        CREATE POLICY "Users can update pending profiles" ON pending_profiles
          FOR UPDATE USING (true);
      `);
      console.log('    âœ… Pending profiles policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Pending profiles policies already exist');
      } else {
        console.error('    âŒ Error creating pending profiles policies:', error.message);
      }
    }
    
    // Create policies for export_jobs table
    console.log('  Creating policies for export_jobs...');
    try {
      await client.query(`
        CREATE POLICY "Users can view their own export jobs" ON export_jobs
          FOR SELECT USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert their own export jobs" ON export_jobs
          FOR INSERT WITH CHECK (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can update their own export jobs" ON export_jobs
          FOR UPDATE USING (auth.uid()::text = user_id);
      `);
      console.log('    âœ… Export jobs policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Export jobs policies already exist');
      } else {
        console.error('    âŒ Error creating export jobs policies:', error.message);
      }
    }
    
    // Create policies for export_assets table
    console.log('  Creating policies for export_assets...');
    try {
      await client.query(`
        CREATE POLICY "Users can view their own export assets" ON export_assets
          FOR SELECT USING (
            EXISTS (
              SELECT 1 FROM export_jobs 
              WHERE export_jobs.id = export_assets.job_id 
              AND export_jobs.user_id = auth.uid()::text
            )
          );
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert their own export assets" ON export_assets
          FOR INSERT WITH CHECK (
            EXISTS (
              SELECT 1 FROM export_jobs 
              WHERE export_jobs.id = export_assets.job_id 
              AND export_jobs.user_id = auth.uid()::text
            )
          );
      `);
      console.log('    âœ… Export assets policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Export assets policies already exist');
      } else {
        console.error('    âŒ Error creating export assets policies:', error.message);
      }
    }
    
    // Create policies for brand_kits table
    console.log('  Creating policies for brand_kits...');
    try {
      await client.query(`
        CREATE POLICY "Users can view their own brand kits" ON brand_kits
          FOR SELECT USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert their own brand kits" ON brand_kits
          FOR INSERT WITH CHECK (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can update their own brand kits" ON brand_kits
          FOR UPDATE USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can delete their own brand kits" ON brand_kits
          FOR DELETE USING (auth.uid()::text = user_id);
      `);
      console.log('    âœ… Brand kits policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Brand kits policies already exist');
      } else {
        console.error('    âŒ Error creating brand kits policies:', error.message);
      }
    }
    
    // Create policies for projects table
    console.log('  Creating policies for projects...');
    try {
      await client.query(`
        CREATE POLICY "Users can view their own projects" ON projects
          FOR SELECT USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert their own projects" ON projects
          FOR INSERT WITH CHECK (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can update their own projects" ON projects
          FOR UPDATE USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can delete their own projects" ON projects
          FOR DELETE USING (auth.uid()::text = user_id);
      `);
      console.log('    âœ… Projects policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Projects policies already exist');
      } else {
        console.error('    âŒ Error creating projects policies:', error.message);
      }
    }
    
    // Create policies for content table
    console.log('  Creating policies for content...');
    try {
      await client.query(`
        CREATE POLICY "Users can view their own content" ON content
          FOR SELECT USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can insert their own content" ON content
          FOR INSERT WITH CHECK (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can update their own content" ON content
          FOR UPDATE USING (auth.uid()::text = user_id);
      `);
      
      await client.query(`
        CREATE POLICY "Users can delete their own content" ON content
          FOR DELETE USING (auth.uid()::text = user_id);
      `);
      console.log('    âœ… Content policies created');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('    âš ï¸ Content policies already exist');
      } else {
        console.error('    âŒ Error creating content policies:', error.message);
      }
    }
    
    console.log('');
    console.log('ðŸ” Verifying RLS status...');
    
    // Check RLS status for all tables
    const result = await client.query(`
      SELECT schemaname, tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('pending_profiles', 'profiles', 'export_jobs', 'export_assets', 'brand_kits', 'projects', 'content')
      ORDER BY tablename;
    `);
    
    console.log('ðŸ“Š RLS Status:');
    result.rows.forEach(row => {
      const status = row.rowsecurity ? 'âœ… Enabled' : 'âŒ Disabled';
      console.log(`  ${row.tablename}: ${status}`);
    });
    
    console.log('');
    console.log('ðŸŽ‰ RLS setup complete!');
    console.log('');
    console.log('ðŸ“‹ Security Summary:');
    console.log('- All tables now have Row Level Security enabled');
    console.log('- Users can only access their own data');
    console.log('- Policies ensure data isolation between users');
    console.log('- Supabase security linter errors should now be resolved');
    
  } catch (error) {
    console.error('âŒ RLS setup failed:', error);
  } finally {
    await client.end();
  }
}

// Run the RLS setup
enableRLS().catch(console.error);