import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { BeyondCompareInfo } from '../types/config';
import { Logger } from './logger';

/**
 * Beyond Compare 路径检测工具
 */
export class BeyondComparePath {
  private static readonly WINDOWS_PATHS = [
    'C:\\Program Files\\Beyond Compare 4\\BCompare.exe',
    'C:\\Program Files (x86)\\Beyond Compare 4\\BCompare.exe',
    'C:\\Program Files\\Beyond Compare 3\\BCompare.exe',
    'C:\\Program Files (x86)\\Beyond Compare 3\\BCompare.exe'
  ];

  private static readonly MACOS_PATHS = [
    '/Applications/Beyond Compare.app/Contents/MacOS/bcomp',
    '/usr/local/bin/bcomp'
  ];

  private static readonly LINUX_PATHS = [
    '/usr/bin/bcompare',
    '/usr/local/bin/bcompare'
  ];

  /**
   * 获取 Beyond Compare 可执行文件路径
   */
  static async findBeyondCompare(): Promise<BeyondCompareInfo> {
    Logger.info('开始检测 Beyond Compare 路径...');

    // 1. 优先使用用户配置的路径
    const config = vscode.workspace.getConfiguration('beyondCompare');
    const customPath = config.get<string>('executablePath', '').trim();
    
    if (customPath) {
      Logger.debug('检查用户配置的路径:', customPath);
      if (await this.isValidPath(customPath)) {
        Logger.info('使用用户配置的 Beyond Compare 路径:', customPath);
        return { path: customPath, isValid: true };
      } else {
        Logger.warn('用户配置的路径无效:', customPath);
      }
    }

    // 2. 根据平台检测默认路径
    const platform = process.platform;
    Logger.debug('当前平台:', platform);

    let defaultPaths: string[] = [];
    if (platform === 'win32') {
      defaultPaths = this.WINDOWS_PATHS;
    } else if (platform === 'darwin') {
      defaultPaths = this.MACOS_PATHS;
    } else {
      defaultPaths = this.LINUX_PATHS;
    }

    for (const bcPath of defaultPaths) {
      Logger.debug('检查默认路径:', bcPath);
      if (await this.isValidPath(bcPath)) {
        Logger.info('找到 Beyond Compare 路径:', bcPath);
        return { path: bcPath, isValid: true };
      }
    }

    // 3. 尝试从 PATH 环境变量查找
    const pathEnv = process.env.PATH || '';
    const pathCommand = platform === 'win32' ? 'BCompare.exe' : 'bcomp';
    
    Logger.debug('从 PATH 环境变量查找:', pathCommand);
    const envPath = this.findInPath(pathCommand, pathEnv);
    if (envPath && await this.isValidPath(envPath)) {
      Logger.info('从 PATH 找到 Beyond Compare:', envPath);
      return { path: envPath, isValid: true };
    }

    Logger.error('未找到 Beyond Compare 安装路径');
    return { path: '', isValid: false };
  }

  /**
   * 检查路径是否有效
   */
  private static async isValidPath(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.promises.stat(filePath);
      return stats.isFile();
    } catch (error) {
      return false;
    }
  }

  /**
   * 从 PATH 环境变量中查找命令
   */
  private static findInPath(command: string, pathEnv: string): string | null {
    const separator = process.platform === 'win32' ? ';' : ':';
    const paths = pathEnv.split(separator);

    for (const dir of paths) {
      const fullPath = path.join(dir, command);
      try {
        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      } catch (error) {
        // 忽略错误，继续查找
      }
    }

    return null;
  }

  /**
   * 启动 Beyond Compare 进行比较
   * @param leftPath 左侧路径（通常是临时文件/目录）
   * @param rightPath 右侧路径（工作区文件/目录）
   * @param onClose 关闭时的回调函数
   */
  static async launchCompare(
    leftPath: string, 
    rightPath: string,
    onClose?: () => void
  ): Promise<void> {
    const bcInfo = await this.findBeyondCompare();

    if (!bcInfo.isValid) {
      throw new Error('未找到 Beyond Compare。请安装 Beyond Compare 或在设置中配置可执行文件路径。');
    }

    Logger.info('=== 启动 Beyond Compare ===');
    Logger.info(`Beyond Compare 路径: ${bcInfo.path}`);
    Logger.info(`左侧路径: ${leftPath}`);
    Logger.info(`右侧路径: ${rightPath}`);
    
    // 检查路径是否存在
    if (!fs.existsSync(leftPath)) {
      Logger.error(`左侧路径不存在: ${leftPath}`);
      throw new Error(`左侧路径不存在: ${leftPath}`);
    }
    if (!fs.existsSync(rightPath)) {
      Logger.error(`右侧路径不存在: ${rightPath}`);
      throw new Error(`右侧路径不存在: ${rightPath}`);
    }
    
    Logger.debug(`左侧路径存在: ${leftPath}`);
    Logger.debug(`右侧路径存在: ${rightPath}`);

    const { spawn } = require('child_process');
    const args = [leftPath, rightPath];
    
    Logger.debug(`执行命令: ${bcInfo.path} ${args.join(' ')}`);

    try {
      const child = spawn(bcInfo.path, args, {
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      // 监听错误输出
      child.stderr?.on('data', (data: Buffer) => {
        Logger.warn('Beyond Compare stderr:', data.toString());
      });
      
      child.on('error', (error: Error) => {
        Logger.error('Beyond Compare 进程错误:', error.message);
      });
      
      // 监听进程退出，执行清理回调
      child.on('exit', (code: number | null, signal: string | null) => {
        Logger.info(`Beyond Compare 进程已退出 (代码: ${code}, 信号: ${signal})`);
        
        // 执行清理回调
        if (onClose) {
          Logger.debug('执行关闭后清理...');
          try {
            onClose();
          } catch (error) {
            Logger.error('清理回调执行失败:', error);
          }
        }
      });

      child.unref(); // 允许父进程退出

      Logger.info('✓ Beyond Compare 进程已启动');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('启动 Beyond Compare 失败:', errorMessage);
      throw new Error(`启动 Beyond Compare 失败: ${errorMessage}`);
    }
  }
}

