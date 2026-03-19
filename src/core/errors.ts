export const ExitCode = {
  SUCCESS: 0,
  GENERAL_ERROR: 1,
  INVALID_USAGE: 2,
  CONFIG_CORRUPT: 3,
  PROJECT_NOT_FOUND: 4,
  PROJECT_ALREADY_EXISTS: 5,
} as const;

export class CdpError extends Error {
  constructor(
    message: string,
    public readonly exitCode: number = ExitCode.GENERAL_ERROR
  ) {
    super(message);
    this.name = "CdpError";
  }
}

export class ConfigCorruptError extends CdpError {
  constructor(message: string) {
    super(message, ExitCode.CONFIG_CORRUPT);
    this.name = "ConfigCorruptError";
  }
}

export class ProjectNotFoundError extends CdpError {
  constructor(name: string) {
    super(`Project '${name}' not found.`, ExitCode.PROJECT_NOT_FOUND);
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectAlreadyExistsError extends CdpError {
  constructor(name: string) {
    super(`Project '${name}' already exists.`, ExitCode.PROJECT_ALREADY_EXISTS);
    this.name = "ProjectAlreadyExistsError";
  }
}

export class ValidationError extends CdpError {
  constructor(message: string) {
    super(message, ExitCode.INVALID_USAGE);
    this.name = "ValidationError";
  }
}
