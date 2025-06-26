import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Get the appropriate data directory following platform conventions
 * - Linux/Unix: follows XDG Base Directory Specification ($XDG_DATA_HOME or ~/.local/share)
 * - macOS: ~/Library/Application Support
 * - Windows: %LOCALAPPDATA%
 */
function getDataDirectory(): string {
  // Allow override via environment variable for deployment flexibility
  if (process.env.DATABASE_PATH) {
    return path.dirname(process.env.DATABASE_PATH);
  }

  const platform = os.platform();
  const homeDir = os.homedir();

  switch (platform) {
    case 'win32':
      // Windows: Use LOCALAPPDATA
      return process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local');

    case 'darwin':
      // macOS: Use ~/Library/Application Support
      return path.join(homeDir, 'Library', 'Application Support');

    default:
      // Linux/Unix: Follow XDG Base Directory Specification
      return process.env.XDG_DATA_HOME || path.join(homeDir, '.local', 'share');
  }
}

/**
 * Get the full database path with application-specific subdirectory
 */
export function getDatabasePath(): string {
  // If DATABASE_PATH is explicitly set, use it directly
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  const dataDir = getDataDirectory();
  const appDataDir = path.join(dataDir, 'mit-mcp');
  const dbPath = path.join(appDataDir, 'data.db');

  return dbPath;
}

/**
 * Ensure the database directory exists
 */
export function ensureDatabaseDirectory(): void {
  const dbPath = getDatabasePath();
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}
