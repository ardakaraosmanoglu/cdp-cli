export function validateProjectName(name: string): void {
  if (!name || !name.trim()) {
    throw new Error("Project name cannot be empty.");
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) {
    throw new Error("Project name can only contain letters, numbers, dots, underscores, and dashes.");
  }
}
