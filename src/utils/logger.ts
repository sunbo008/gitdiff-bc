import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { LogLevel } from '../types/config';

/**
 * 日志记录器
 */
export class Logger {
  private static outputChannel: vscode.OutputChannel;
  private static logLevel: LogLevel = 'info';
  private static logFilePath: string | null = null;
  private static fileLoggingEnabled: boolean = true;

  private static readonly LOG_LEVELS: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };

  static initialize(context: vscode.ExtensionContext): void {
    try {
      // 即使已经初始化也记录日志
      const isReinit = !!this.outputChannel;
      
      if (!this.outputChannel) {
        this.outputChannel = vscode.window.createOutputChannel('Beyond Compare Git');
        context.subscriptions.push(this.outputChannel);
      }
      
      this.updateLogLevel();
      
      // 异步初始化文件日志（不阻塞）
      this.initFileLogging();
      
      // 记录初始化信息
      this.info('=================================================');
      this.info(`Logger 初始化 ${isReinit ? '(重新初始化)' : '(首次初始化)'}`);
      this.info(`时间: ${new Date().toISOString()}`);
      this.info(`日志级别: ${this.logLevel}`);
      this.info(`日志文件: ${this.logFilePath || '异步初始化中...'}`);
      this.info(`VSCode 版本: ${vscode.version}`);
      this.info(`平台: ${process.platform}`);
      this.info('=================================================');
    } catch (error) {
      console.error('Logger 初始化失败:', error);
      // 即使初始化失败，也不应该阻止扩展激活
    }
  }

  private static initFileLogging(): void {
    // 异步初始化，不阻塞激活
    setImmediate(() => {
      try {
        // 创建日志目录
        const logDir = path.join(os.tmpdir(), 'gitdiff-bc-logs');
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true });
        }
        
        // 创建日志文件（按日期命名）
        const dateStr = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();
        this.logFilePath = path.join(logDir, `gitdiff-bc-${dateStr}-${timestamp}.log`);
        
        // 写入文件头
        const header = [
          '=================================================',
          'Beyond Compare Git 扩展日志',
          `时间: ${new Date().toISOString()}`,
          `平台: ${process.platform}`,
          `Node 版本: ${process.version}`,
          `VSCode 版本: ${vscode.version}`,
          '=================================================\n'
        ].join('\n');
        
        fs.writeFileSync(this.logFilePath, header, 'utf8');
        this.fileLoggingEnabled = true;
        
        console.log(`日志文件已创建: ${this.logFilePath}`);
      } catch (error) {
        console.error('初始化文件日志失败:', error);
        this.fileLoggingEnabled = false;
      }
    });
  }

  static updateLogLevel(): void {
    const config = vscode.workspace.getConfiguration('beyondCompare');
    this.logLevel = config.get<LogLevel>('logLevel', 'info');
  }

  private static shouldLog(level: LogLevel): boolean {
    return this.LOG_LEVELS[level] <= this.LOG_LEVELS[this.logLevel];
  }

  private static log(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelStr = level.toUpperCase().padEnd(5);
    const formattedMessage = `[${timestamp}] [${levelStr}] ${message}`;
    
    // 格式化参数
    let argsStr = '';
    if (args.length > 0) {
      try {
        argsStr = '\n' + JSON.stringify(args, null, 2);
      } catch (e) {
        argsStr = '\n' + String(args);
      }
    }
    
    const fullMessage = formattedMessage + argsStr;
    
    // 输出到控制台（始终输出，方便调试）
    console.log(fullMessage);
    
    // 输出到 VSCode Output Channel
    if (this.outputChannel) {
      this.outputChannel.appendLine(formattedMessage);
      if (args.length > 0) {
        this.outputChannel.appendLine(argsStr);
      }
    }
    
    // 输出到文件
    if (this.fileLoggingEnabled && this.logFilePath) {
      try {
        fs.appendFileSync(this.logFilePath, fullMessage + '\n', 'utf8');
      } catch (error) {
        console.error('写入日志文件失败:', error);
        this.fileLoggingEnabled = false;
      }
    }
  }

  static error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  static warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  static info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  static debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  static show(): void {
    if (this.outputChannel) {
      this.outputChannel.show();
    }
  }

  static getLogFilePath(): string | null {
    return this.logFilePath;
  }

  static showLogFile(): void {
    if (this.logFilePath && fs.existsSync(this.logFilePath)) {
      vscode.window.showInformationMessage(
        `日志文件: ${this.logFilePath}`,
        '打开日志文件',
        '打开日志目录',
        '复制路径'
      ).then(action => {
        if (action === '打开日志文件') {
          vscode.workspace.openTextDocument(this.logFilePath!).then(doc => {
            vscode.window.showTextDocument(doc);
          });
        } else if (action === '打开日志目录') {
          const logDir = path.dirname(this.logFilePath!);
          vscode.env.openExternal(vscode.Uri.file(logDir));
        } else if (action === '复制路径') {
          vscode.env.clipboard.writeText(this.logFilePath!);
          vscode.window.showInformationMessage('日志文件路径已复制到剪贴板');
        }
      });
    } else {
      vscode.window.showWarningMessage('日志文件不存在');
    }
  }

  static openLogDirectory(): void {
    if (this.logFilePath) {
      const logDir = path.dirname(this.logFilePath);
      vscode.env.openExternal(vscode.Uri.file(logDir));
    }
  }
}

