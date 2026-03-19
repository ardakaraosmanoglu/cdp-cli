import process from "node:process";

export function printSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

export function printError(message: string): void {
  console.error(`❌ ${message}`);
}

export function printWarning(message: string): void {
  console.warn(`⚠️  ${message}`);
}

export function printInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

export function printLine(message: string): void {
  console.log(message);
}
