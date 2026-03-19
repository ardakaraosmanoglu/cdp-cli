export function isWindows(): boolean {
  return process.platform === "win32";
}

export function isMac(): boolean {
  return process.platform === "darwin";
}

export function isLinux(): boolean {
  return process.platform === "linux";
}

export function getPlatform(): "windows" | "mac" | "linux" | "unknown" {
  if (isWindows()) return "windows";
  if (isMac()) return "mac";
  if (isLinux()) return "linux";
  return "unknown";
}
