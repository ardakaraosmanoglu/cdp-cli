import { styleText } from "node:util";

export const colors = {
  success: (text: string) => styleText("green", text),
  error: (text: string) => styleText("red", text),
  warning: (text: string) => styleText("yellow", text),
  info: (text: string) => styleText("cyan", text),
  bold: (text: string) => styleText("bold", text),
  dim: (text: string) => styleText("dim", text),
};

export function success(message: string): void {
  console.log(colors.success("✓") + " " + message);
}

export function error(message: string): void {
  console.error(colors.error("✗") + " " + message);
}

export function warning(message: string): void {
  console.log(colors.warning("⚠") + " " + message);
}

export function info(message: string): void {
  console.log(colors.info("ℹ") + " " + message);
}
