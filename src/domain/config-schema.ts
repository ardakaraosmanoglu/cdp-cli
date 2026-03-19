import type { CdpConfig } from "./project.js";

export const CONFIG_VERSION = 1;

export function validateConfig(config: unknown): config is CdpConfig {
  if (!config || typeof config !== "object") return false;
  const c = config as Record<string, unknown>;
  if (typeof c.version !== "number") return false;
  if (!c.projects || typeof c.projects !== "object") return false;
  return true;
}

export function createConfig(): CdpConfig {
  return {
    version: CONFIG_VERSION,
    projects: {},
  };
}
