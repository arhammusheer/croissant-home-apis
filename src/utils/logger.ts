import morgan from "morgan";

enum LogLevel {
  DEV = "dev", // Allow all logs
  PROD = "prod", // Allow only info and error logs
  TEST = "test", // Allow only error logs
  OFF = "off", // Allow no logs
}

enum LogType {
  INFO = "info",
  ERROR = "error",
  LOG = "log",
  WARN = "warn",
}

const logLevel = process.env.LOG_LEVEL || LogLevel.DEV;

class LoggerClass {
  private _logLevel: LogLevel = LogLevel.DEV; // Default to dev

  public set level(level: LogLevel) {
    this._logLevel = level;
  }

  private _shouldLog(level: LogLevel, type: LogType) {
    // If the current log level is dev, allow all logs
    switch (level) {
      case LogLevel.DEV: // Allow all logs
        return true;
      case LogLevel.PROD: // Allow only info and error logs
        return type === LogType.INFO || type === LogType.ERROR;
      case LogLevel.TEST: // Allow only error logs
        return type === LogType.ERROR;
      default:
        return false;
    }
  }

  public info(owner: string, ...args: any[]) {
    if (this._shouldLog(this._logLevel, LogType.INFO)) {
      console.info(`[${owner}]`, ...args);
    }
  }
  public error(owner: string, ...args: any[]) {
    if (this._shouldLog(this._logLevel, LogType.ERROR)) {
      console.error(`[${owner}]`, ...args);
    }
  }

  public log(owner: string, ...args: any[]) {
    if (this._shouldLog(this._logLevel, LogType.LOG)) {
      console.log(`[${owner}]`, ...args);
    }
  }

  public warn(owner: string, ...args: any[]) {
    if (this._shouldLog(this._logLevel, LogType.WARN)) {
      console.warn(`[${owner}]`, ...args);
    }
  }
}

export const logger = new LoggerClass();

export const morganwrapped = () => {
  const OWNER = "Morgan";

  switch (logLevel) {
    case LogLevel.DEV:
      return morgan(
        `[${OWNER}] :method :url :status :response-time ms - :res[content-length]`
      );
    case LogLevel.PROD:
      return morgan(
        `[${OWNER}] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
      );
    case LogLevel.TEST:
      return morgan(
        `[${OWNER}] :method :url :status :response-time ms - :res[content-length]`,
        { skip: (req, res) => res.statusCode < 400 }
      );
    default:
      return morgan(
        `[${OWNER}] :method :url :status :response-time ms - :res[content-length]`
      );
  }
};

logger.level = logLevel as LogLevel;
