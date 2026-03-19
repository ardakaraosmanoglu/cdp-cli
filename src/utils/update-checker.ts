import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE = ".cdp-update-check";

interface CacheData {
  lastCheck: number;
  latestVersion: string | null;
}

export async function checkForUpdates(): Promise<void> {
  try {
    const pkg = await getPackageVersion();
    const cache = await getCache();
    const now = Date.now();

    if (cache.lastCheck && now - cache.lastCheck < UPDATE_CHECK_INTERVAL) {
      return; // Skip check, cached
    }

    const latestVersion = await fetchLatestVersion(pkg.name);
    
    if (latestVersion && isNewerVersion(latestVersion, pkg.version)) {
      console.error(`\n⚠️  Update available: ${pkg.version} → ${latestVersion}`);
      console.error(`   Run: npm install -g ${pkg.name}\n`);
    }

    await saveCache({ lastCheck: now, latestVersion });
  } catch {
    // Silently ignore update check failures
  }
}

export async function getPackageVersion(): Promise<{ name: string; version: string }> {
  const pkgPath = join(process.cwd(), "package.json");
  try {
    const content = await readFile(pkgPath, "utf8");
    const pkg = JSON.parse(content);
    return { name: pkg.name, version: pkg.version };
  } catch {
    // Fallback for installed package
    return require("../package.json");
  }
}

async function getCache(): Promise<CacheData> {
  const { getCdpDir } = await import("../core/paths.js");
  const { fileExists, readJsonFile } = await import("./fs.js");
  
  const cachePath = join(getCdpDir(), CACHE_FILE);
  
  if (!(await fileExists(cachePath))) {
    return { lastCheck: 0, latestVersion: null };
  }
  
  return await readJsonFile<CacheData>(cachePath);
}

async function saveCache(data: CacheData): Promise<void> {
  const { getCdpDir } = await import("../core/paths.js");
  const { atomicWriteJson } = await import("./fs.js");
  const { ensureDir } = await import("./fs.js");
  
  const cachePath = join(getCdpDir(), CACHE_FILE);
  await ensureDir(getCdpDir());
  await atomicWriteJson(cachePath, data);
}

export async function fetchLatestVersion(packageName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!response.ok) return null;
    
    const data = await response.json() as { version?: string };
    return data.version || null;
  } catch {
    return null;
  }
}

export function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.split(".").map(Number);
  const currentParts = current.split(".").map(Number);
  
  for (let i = 0; i < 3; i++) {
    const l = latestParts[i] || 0;
    const c = currentParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}
