export interface ProjectEntry {
  path: string;
  createdAt: string;
  updatedAt: string;
}

export interface CdpConfig {
  version: number;
  projects: Record<string, ProjectEntry>;
}
