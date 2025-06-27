import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface PackageJson {
  version?: string;
}

function loadPackageVersion(): string {
  try {
    const packageJsonPath = join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(
      readFileSync(packageJsonPath, 'utf-8'),
    ) as PackageJson;
    return packageJson.version || '0.0.0';
  } catch (error) {
    console.error('Failed to load version from package.json:', error);
    return '0.0.0';
  }
}

export const version = loadPackageVersion();
