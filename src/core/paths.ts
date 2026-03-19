import os from "node:os";
import path from "node:path";

export function getCdpDir(): string {
  return path.join(os.homedir(), ".cdp");
}

export function getConfigPath(): string {
  return path.join(getCdpDir(), "projects.json");
}
