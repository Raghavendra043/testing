import { Injectable } from "@angular/core";
import { lastValueFrom, throwError } from "rxjs";
import { User } from "src/app/types/user.type";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  LogEntriesReadyMessage,
  LogEntry,
  LogLevel,
} from "src/app/types/native.type";
import { NativeService } from "../native-services/native.service";
import {
  ERROR_PASS_THROUGH,
  SILENT_REQUEST,
} from "@app/interceptors/interceptor";

@Injectable({
  providedIn: "root",
})
export class ClientLoggingService {
  private logUrl: string | undefined = undefined;
  private originalConsole: ConsoleWrapper | undefined;

  constructor(private http: HttpClient, private nativeService: NativeService) {
    if (globalThis.console !== undefined) {
      this.originalConsole = {
        log: globalThis.console.log,
        debug: globalThis.console.debug,
        info: globalThis.console.info,
        warn: globalThis.console.warn,
        error: globalThis.console.error,
      };
    } else {
      console.error("Could not find globalThis.console!");
    }
  }

  enable = (logUrl: string): void => {
    this.originalConsole?.debug("Enable client logging");
    this.logUrl = logUrl;
    this.subscribeToNativeLogEntries();
    this.overrideConsoleLogFunctions();
  };

  private subscribeToNativeLogEntries = (): void => {
    this.nativeService.enableClientLogging(
      (logEntriesReady: LogEntriesReadyMessage) => {
        const logEntries: LogEntry[] = logEntriesReady.entries;
        this.submitLogEntriesToBackend(logEntries);
      }
    );
  };

  private overrideConsoleLogFunctions = (): void => {
    const bundleAndSubmitMessage = (message: string, level: LogLevel) => {
      const timestamp = new Date().toISOString();
      const logEntry = {
        level: level,
        message: message,
        timestamp: timestamp,
      };

      this.submitLogEntriesToBackend([logEntry]);
    };

    globalThis.console.log = (message: any) => {
      this.originalConsole?.log(message);
      bundleAndSubmitMessage(message, LogLevel.DEBUG);
    };
    globalThis.console.debug = (message: any) => {
      this.originalConsole?.debug(message);
      bundleAndSubmitMessage(message, LogLevel.DEBUG);
    };
    globalThis.console.info = (message: any) => {
      this.originalConsole?.info(message);
      bundleAndSubmitMessage(message, LogLevel.INFO);
    };
    globalThis.console.warn = (message: any) => {
      this.originalConsole?.warn(message);
      bundleAndSubmitMessage(message, LogLevel.WARN);
    };
    globalThis.console.error = (message: any) => {
      this.originalConsole?.error(message);
      bundleAndSubmitMessage(message, LogLevel.ERROR);
    };
  };

  private submitLogEntriesToBackend = (logEntries: LogEntry[]): void => {
    const context = new HttpContext()
      .set(SILENT_REQUEST, true)
      .set(ERROR_PASS_THROUGH, true);

    try {
      const response = lastValueFrom(
        this.http.post<void>(this.logUrl!, logEntries, { context: context })
      );
      this.originalConsole?.debug("Log entries submitted to backend");
    } catch (error) {
      const msg =
        error instanceof HttpErrorResponse
          ? `Status: ${error.status}`
          : JSON.stringify(error);

      this.originalConsole?.error("Failed to send log entries to backend");
    }
  };
}

interface ConsoleWrapper {
  log(message: any): void;
  debug(message: any): void;
  info(message: any): void;
  warn(message: any): void;
  error(message: any): void;
}
