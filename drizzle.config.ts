import { defineConfig } from 'drizzle-kit';
import os from 'os';
import path from 'path';

// Duplicate the getDatabasePath logic here for drizzle-kit compatibility
// This duplication is necessary because:
// 1. drizzle-kit runs in a different context than our compiled application
// 2. drizzle-kit doesn't support ES modules imports from .ts files that use .js extensions
// 3. Our src/db/config.ts uses .js extensions in imports (required for ESM compatibility)
// 4. drizzle-kit would fail with "Cannot find module './src/db/config.js'" error
// 5. This config file is only used by drizzle-kit CLI commands (generate, push, studio)
// The runtime application uses the centralized config in src/db/config.ts
function getDatabasePath(): string {
  if (process.env.DATABASE_PATH) {
    return process.env.DATABASE_PATH;
  }

  const platform = os.platform();
  const homeDir = os.homedir();
  let dataDir: string;

  switch (platform) {
    case 'win32':
      dataDir =
        process.env.LOCALAPPDATA || path.join(homeDir, 'AppData', 'Local');
      break;
    case 'darwin':
      dataDir = path.join(homeDir, 'Library', 'Application Support');
      break;
    default:
      dataDir =
        process.env.XDG_DATA_HOME || path.join(homeDir, '.local', 'share');
  }

  const appDataDir = path.join(dataDir, 'mit-mcp');
  return path.join(appDataDir, 'data.db');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: getDatabasePath(),
  },
});
