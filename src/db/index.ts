import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { getDatabasePath, ensureDatabaseDirectory } from './config.js';
import * as schema from './schema.js';

let sqlite: Database.Database | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

/**
 * Get or create the database instance
 */
export function getDb() {
  if (!dbInstance) {
    // Ensure the directory exists
    ensureDatabaseDirectory();

    // Get the database path
    const dbPath = getDatabasePath();
    console.error(`[MCP Database] Using database at: ${dbPath}`);

    sqlite = new Database(dbPath);
    dbInstance = drizzle(sqlite, { schema });
  }

  return dbInstance;
}

// Export db for backward compatibility
export const db = getDb();

/**
 * Initialize the database connection and run migrations
 */
export async function initializeDatabase(): Promise<void> {
  // Ensure database is created
  getDb();

  // Import and run migrations
  const { runMigrations } = await import('./migrate.js');
  await runMigrations();
}

export function closeDatabase() {
  if (sqlite) {
    sqlite.close();
    sqlite = null;
    dbInstance = null;
  }
}
