import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from './logger';

const execAsync = promisify(exec);

/**
 * Git 操作工具
 */
export class GitOperations {
  /**
   * 检查路径是否在 Git 仓库中
   */
  static async isInGitRepo(filePath: string): Promise<boolean> {
    try {
      // 使用 fs.statSync 判断是文件还是目录
      let dirPath: string;
      try {
        const stat = fs.statSync(filePath);
        dirPath = stat.isDirectory() ? filePath : path.dirname(filePath);
      } catch {
        // 如果文件不存在，使用父目录
        dirPath = path.dirname(filePath);
      }
      
      const { stdout } = await execAsync('git rev-parse --is-inside-work-tree', { 
        cwd: dirPath,
        encoding: 'utf8'
      });
      const isRepo = stdout.trim() === 'true';
      Logger.debug(`检查 Git 仓库: ${filePath} -> ${isRepo}`);
      return isRepo;
    } catch (error) {
      Logger.debug('检查 Git 仓库失败:', error);
      return false;
    }
  }

  /**
   * 获取文件在 Git HEAD 中的内容
   */
  static async getFileContentAtHead(filePath: string): Promise<string> {
    try {
      const dirPath = path.dirname(filePath);
      
      // 获取 Git 仓库根目录
      const { stdout: repoRoot } = await execAsync('git rev-parse --show-toplevel', {
        cwd: dirPath,
        encoding: 'utf8'
      });
      
      // 计算相对路径并规范化 Unicode
      const relativePath = path.relative(repoRoot.trim(), filePath);
      const normalizedPath = relativePath
        .normalize('NFC')  // Unicode 规范化（Git 使用 NFC）
        .split(path.sep)
        .join('/');
      
      Logger.debug(`获取 HEAD 版本文件: ${normalizedPath}`);
      
      // 获取 HEAD 版本的文件内容
      const { stdout: content } = await execAsync(`git show "HEAD:${normalizedPath}"`, {
        cwd: dirPath,
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 // 10MB
      });
      
      Logger.info(`成功获取 HEAD 版本文件内容: ${normalizedPath}`);
      return content;
    } catch (error: any) {
      const errorMessage = error.message || String(error);
      const stderr = error.stderr || '';
      Logger.error('获取 Git HEAD 文件内容失败:', errorMessage);
      
      if (errorMessage.includes('does not exist') || 
          errorMessage.includes('Path') || 
          stderr.includes('does not exist')) {
        throw new Error('文件不在 Git 版本控制中，无法比较。');
      }
      
      throw new Error(`获取 Git HEAD 文件内容失败: ${errorMessage}`);
    }
  }

  /**
   * 检查文件是否在 Git 版本控制中
   */
  static async isFileTracked(filePath: string): Promise<boolean> {
    try {
      const dirPath = path.dirname(filePath);
      
      // 获取仓库根目录
      const { stdout: repoRoot } = await execAsync('git rev-parse --show-toplevel', {
        cwd: dirPath,
        encoding: 'utf8'
      });
      
      const relativePath = path.relative(repoRoot.trim(), filePath);
      
      // 对于 macOS，规范化 Unicode 为 NFC 格式（Git 使用的格式）
      const normalizedPath = relativePath
        .normalize('NFC')  // Unicode 规范化
        .split(path.sep)
        .join('/');
      
      Logger.debug(`检查文件跟踪状态: ${normalizedPath}`);
      
      // 方法1: 使用 git ls-files 检查
      try {
        const { stdout: lsFilesResult } = await execAsync(`git ls-files -- "${normalizedPath}"`, {
          cwd: dirPath,
          encoding: 'utf8'
        });
        if (lsFilesResult.trim().length > 0) {
          Logger.debug(`文件已跟踪 (ls-files): ${normalizedPath}`);
          return true;
        }
      } catch (e) {
        // 继续尝试其他方法
      }
      
      // 方法2: 使用 git status 检查
      try {
        const { stdout: statusResult } = await execAsync(`git status --porcelain -- "${normalizedPath}"`, {
          cwd: dirPath,
          encoding: 'utf8'
        });
        if (statusResult.trim().length > 0 && !statusResult.trim().startsWith('??')) {
          Logger.debug(`文件已跟踪 (status): ${normalizedPath}`);
          return true;
        }
      } catch (e) {
        // 继续尝试其他方法
      }
      
      // 方法3: 直接尝试获取 HEAD 版本（最可靠的方法）
      try {
        await execAsync(`git show "HEAD:${normalizedPath}"`, {
          cwd: dirPath,
          encoding: 'utf8'
        });
        Logger.debug(`文件已跟踪 (HEAD): ${normalizedPath}`);
        return true;
      } catch (e) {
        // 文件不在 HEAD 中
      }
      
      Logger.debug(`文件未跟踪: ${normalizedPath}`);
      return false;
    } catch (error) {
      Logger.error('检查文件跟踪状态失败:', error);
      return false;
    }
  }

  /**
   * 获取 Git 仓库根目录
   */
  static async getRepoRoot(filePath: string): Promise<string> {
    try {
      // 使用 fs.statSync 判断是文件还是目录
      let dirPath: string;
      try {
        const stat = fs.statSync(filePath);
        dirPath = stat.isDirectory() ? filePath : path.dirname(filePath);
      } catch {
        // 如果文件不存在，使用父目录
        dirPath = path.dirname(filePath);
      }
      
      const { stdout } = await execAsync('git rev-parse --show-toplevel', {
        cwd: dirPath,
        encoding: 'utf8'
      });
      return stdout.trim();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('获取 Git 仓库根目录失败:', errorMessage);
      throw new Error('当前目录不是 Git 仓库。');
    }
  }
}

