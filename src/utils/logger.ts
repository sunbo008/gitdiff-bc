import * as vscode from 'vscode';
import { LogLevel } from '../types/config';

/**
 * 日志记录器
 */
export class Logger {
  private static outputChannel: vscode.OutputChannel;
  private static logLevel: LogLevel = 'info';

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
      
      // 记录初始化信息
      this.info('=================================================');
      this.info(`Logger 初始化 ${isReinit ? '(重新初始化)' : '(首次初始化)'}`);
      this.info(`时间: ${new Date().toISOString()}`);
      this.info(`日志级别: ${this.logLevel}`);
      this.info(`VSCode 版本: ${vscode.version}`);
      this.info(`平台: ${process.platform}`);
      this.info('=================================================');
    } catch (error) {
      console.error('Logger 初始化失败:', error);
      // 即使初始化失败，也不应该阻止扩展激活
    }
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
}
