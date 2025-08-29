type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

class Logger {
  private reset = "\x1b[0m";

  private colors: Record<LogLevel, string> = {
    INFO: "\x1b[32m", // green
    WARN: "\x1b[33m", // yellow
    ERROR: "\x1b[31m", // red
    DEBUG: "\x1b[36m", // cyan
  };

  private gray = "\x1b[90m"; // gray for timestamp

  private format(level: LogLevel, args: any[]) {
    const now = new Date();
    const color = this.colors[level];

    console.log(
      `${color}[${level}]${this.reset} ${this.gray}${now.toLocaleString()}${this.reset} -`,
      ...args
    );
  }

  info(...args: any[]) {
    this.format("INFO", args);
  }

  warn(...args: any[]) {
    this.format("WARN", args);
  }

  error(...args: any[]) {
    this.format("ERROR", args);
  }

  debug(...args: any[]) {
    if (process.env.NODE_ENV === "development") {
      this.format("DEBUG", args);
    }
  }
}

export default new Logger();
