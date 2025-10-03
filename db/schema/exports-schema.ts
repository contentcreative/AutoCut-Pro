import { pgTable, text, timestamp, integer, jsonb, uuid, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Export Jobs Table - Main table for tracking export jobs
export const exportJobs = pgTable('export_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  projectId: uuid('project_id'), // Optional: link to a project
  contentId: uuid('content_id'), // Optional: link to specific content
  
  // Job Configuration
  formats: jsonb('formats').notNull(), // Array of format objects: [{ratio: "9:16", resolution: "1080x1920", bitrate: "6M", fps: 30}]
  options: jsonb('options').default({}), // Export options: {generateThumbnails: true, thumbnailTimecode: "00:00:01", metadataOverrides: {...}}
  brandKitId: uuid('brand_kit_id'), // Optional: link to brand kit for overlays
  
  // Source Video
  sourceVideoPath: text('source_video_path').notNull(), // Path in Supabase Storage
  storageBucket: text('storage_bucket').default('source-videos'), // Source bucket name
  
  // Job Status & Progress
  status: text('status', { 
    enum: ['queued', 'processing', 'packaging', 'uploaded', 'ready', 'failed', 'canceled'] 
  }).notNull().default('queued'),
  progress: integer('progress').notNull().default(0), // 0-100 percentage
  
  // Output
  zipStoragePath: text('zip_storage_path'), // Path to final ZIP in exports bucket
  zipSizeBytes: integer('zip_size_bytes'), // Size of final ZIP file
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // Error Handling
  error: text('error'), // Error message if job failed
  retryCount: integer('retry_count').default(0), // Number of retry attempts
  
  // Worker Info
  workerId: text('worker_id'), // ID of worker processing this job
  processingStartedAt: timestamp('processing_started_at'),
});

// Export Assets Table - Individual assets within an export job
export const exportAssets = pgTable('export_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').notNull().references(() => exportJobs.id, { onDelete: 'cascade' }),
  
  // Asset Info
  type: text('type', { enum: ['video', 'thumbnail', 'metadata'] }).notNull(),
  variant: text('variant').notNull(), // e.g., "9x16", "9x16-thumb", "title.txt"
  
  // File Info
  storagePath: text('storage_path'), // Path in storage (or "N/A (packed in zip)")
  sizeBytes: integer('size_bytes').notNull(),
  checksum: text('checksum').notNull(), // MD5 hash for integrity verification
  
  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Brand Kits Table - For brand overlay functionality
export const brandKits = pgTable('brand_kits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  name: text('name').notNull(),
  description: text('description'),
  
  // Brand Assets
  logoPath: text('logo_path'), // Path to logo in brand-assets bucket
  logoPosition: text('logo_position').default('top-right'), // Position for overlay
  logoSize: text('logo_size').default('small'), // small, medium, large
  
  // Colors
  primaryColor: text('primary_color'),
  secondaryColor: text('secondary_color'),
  
  // FFmpeg Filters (computed from assets)
  overlayFilter: text('overlay_filter'), // e.g., "overlay=10:10"
  thumbnailOverlayFilter: text('thumbnail_overlay_filter'), // e.g., "overlay=5:5"
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Projects Table - Optional project organization
export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  name: text('name').notNull(),
  description: text('description'),
  
  // Project Settings
  defaultBrandKitId: uuid('default_brand_kit_id').references(() => brandKits.id),
  defaultFormats: jsonb('default_formats'), // Default export formats for this project
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Content Table - Optional content organization
export const content = pgTable('content', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(), // Clerk user ID
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  
  // Content Info
  title: text('title').notNull(),
  description: text('description'),
  sourceVideoPath: text('source_video_path').notNull(), // Path in source-videos bucket
  
  // Metadata
  duration: integer('duration'), // Duration in seconds
  fileSizeBytes: integer('file_size_bytes'),
  resolution: text('resolution'), // e.g., "1920x1080"
  fps: integer('fps'),
  
  // Status
  isActive: boolean('is_active').default(true),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define Relations
export const exportJobsRelations = relations(exportJobs, ({ one, many }) => ({
  brandKit: one(brandKits, {
    fields: [exportJobs.brandKitId],
    references: [brandKits.id],
  }),
  project: one(projects, {
    fields: [exportJobs.projectId],
    references: [projects.id],
  }),
  content: one(content, {
    fields: [exportJobs.contentId],
    references: [content.id],
  }),
  assets: many(exportAssets),
}));

export const exportAssetsRelations = relations(exportAssets, ({ one }) => ({
  job: one(exportJobs, {
    fields: [exportAssets.jobId],
    references: [exportJobs.id],
  }),
}));

export const brandKitsRelations = relations(brandKits, ({ many }) => ({
  exportJobs: many(exportJobs),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(brandKits, {
    fields: [projects.defaultBrandKitId],
    references: [brandKits.id],
  }),
  exportJobs: many(exportJobs),
  content: many(content),
}));

export const contentRelations = relations(content, ({ one, many }) => ({
  project: one(projects, {
    fields: [content.projectId],
    references: [projects.id],
  }),
  exportJobs: many(exportJobs),
}));

// Export types for TypeScript
export type ExportJob = typeof exportJobs.$inferSelect;
export type NewExportJob = typeof exportJobs.$inferInsert;
export type ExportAsset = typeof exportAssets.$inferSelect;
export type NewExportAsset = typeof exportAssets.$inferInsert;
export type BrandKit = typeof brandKits.$inferSelect;
export type NewBrandKit = typeof brandKits.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Content = typeof content.$inferSelect;
export type NewContent = typeof content.$inferInsert;
