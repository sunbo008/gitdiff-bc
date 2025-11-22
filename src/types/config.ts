/**
 * 配置类型定义
 */

export interface ExtensionConfig {
  executablePath: string;
  logLevel: LogLevel;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface BeyondCompareInfo {
  path: string;
  isValid: boolean;
}

