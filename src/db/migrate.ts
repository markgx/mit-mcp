import path from 'path';
import { fileURLToPath } from 'url';

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { db } from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run database migrations
 * Applies all pending migrations from the drizzle directory
 */
export async function runMigrations(): Promise<void> {
  try {
    console.error('[MCP Database] Running migrations...');

    // The migrations folder is at the project root
    // When bundled with esbuild, __dirname will be the dist folder
    const migrationsFolder = path.resolve(__dirname, '..', 'drizzle');

    console.error(
      `[MCP Database] Looking for migrations in: ${migrationsFolder}`,
    );

    // Run migrations
    migrate(db, { migrationsFolder });

    console.error('[MCP Database] Migrations completed successfully');
  } catch (error) {
    console.error('[MCP Database] Migration failed:', error);
    throw new Error(
      `Database migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
