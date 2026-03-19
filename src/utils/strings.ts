export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function padRight(str: string, length: number): string {
  return str.padEnd(length, " ");
}

export function padLeft(str: string, length: number): string {
  return str.padStart(length, " ");
}
