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
      const repoRoot = await this.getRepoRoot(filePath);
      const relativePath = path.relative(repoRoot, filePath);
      const normalizedPath = relativePath
        .normalize('NFC')
        .split(path.sep)
        .join('/');
      
      Logger.debug(`获取 HEAD 版本文件: ${normalizedPath}`);
      
      // 使用仓库根目录作为 cwd
      const { stdout: content } = await execAsync(`git show "HEAD:${normalizedPath}"`, {
        cwd: repoRoot,
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
      const repoRoot = await this.getRepoRoot(filePath);
      const relativePath = path.relative(repoRoot, filePath);
      const normalizedPath = relativePath
        .normalize('NFC')
        .split(path.sep)
        .join('/');
      
      Logger.debug(`检查文件跟踪状态: ${normalizedPath}`);
      
      // 方法1: 使用 git ls-files 检查
      try {
        const { stdout: lsFilesResult } = await execAsync(`git ls-files -- "${normalizedPath}"`, {
          cwd: repoRoot,
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
          cwd: repoRoot,
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
          cwd: repoRoot,
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

  /**
   * 检查文件是否有未提交的修改
   */
  static async hasUncommittedChanges(filePath: string): Promise<boolean> {
    try {
      const repoRoot = await this.getRepoRoot(filePath);
      const relativePath = path.relative(repoRoot, filePath);
      const normalizedPath = relativePath
        .normalize('NFC')
        .split(path.sep)
        .join('/');
      
      Logger.debug(`检查文件修改状态: ${normalizedPath}`);
      
      // 使用仓库根目录作为 cwd
      const { stdout } = await execAsync(`git status --porcelain -- "${normalizedPath}"`, {
        cwd: repoRoot,
        encoding: 'utf8'
      });
      
      const hasChanges = stdout.trim().length > 0 && !stdout.trim().startsWith('??');
      Logger.debug(`文件修改状态: ${hasChanges ? '有修改' : '无修改'}`);
      return hasChanges;
    } catch (error) {
      Logger.error('检查文件修改状态失败:', error);
      return false;
    }
  }

  /**
   * 检测 Git 版本是否支持 restore 命令
   */
  static async supportsGitRestore(): Promise<boolean> {
    try {
      const { stdout } = await execAsync('git --version', { encoding: 'utf8' });
      const match = stdout.match(/git version (\d+)\.(\d+)/);
      if (match) {
        const major = parseInt(match[1]);
        const minor = parseInt(match[2]);
        const supportsRestore = major > 2 || (major === 2 && minor >= 23);
        Logger.debug(`Git 版本: ${major}.${minor}, 支持 restore: ${supportsRestore}`);
        return supportsRestore;
      }
      Logger.warn('无法检测 Git 版本，使用默认命令');
      return false;
    } catch (error) {
      Logger.warn('检测 Git 版本失败，使用默认命令:', error);
      return false;
    }
  }

  /**
   * 撤销文件的修改，恢复到 HEAD 版本
   */
  static async revertFile(filePath: string): Promise<void> {
    try {
      const repoRoot = await this.getRepoRoot(filePath);
      const relativePath = path.relative(repoRoot, filePath);
      const normalizedPath = relativePath
        .normalize('NFC')
        .split(path.sep)
        .join('/');
      
      Logger.info(`执行 revert: ${normalizedPath}`);
      
      // 检测是否支持 git restore
      const useRestore = await this.supportsGitRestore();
      
      let gitCommand: string;
      if (useRestore) {
        gitCommand = `git restore "${normalizedPath}"`;
        Logger.debug('使用 git restore 命令');
      } else {
        gitCommand = `git checkout HEAD -- "${normalizedPath}"`;
        Logger.debug('使用 git checkout 命令 (Git 版本 < 2.23)');
      }
      
      // 使用仓库根目录作为 cwd
      await execAsync(gitCommand, {
        cwd: repoRoot,
        encoding: 'utf8'
      });
      
      Logger.info(`revert 成功: ${normalizedPath}`);
    } catch (error: any) {
      const errorMessage = error.message || String(error);
      Logger.error('执行 revert 失败:', errorMessage);
      throw new Error(`撤销修改失败: ${errorMessage}`);
    }
  }

  /**
   * 撤销文件夹的修改，恢复到 HEAD 版本
   */
  static async revertFolder(folderPath: string): Promise<number> {
    try {
      const repoRoot = await this.getRepoRoot(folderPath);
      const relativePath = path.relative(repoRoot, folderPath);
      const normalizedPath = relativePath
        .normalize('NFC')
        .split(path.sep)
        .join('/') || '.';
      
      Logger.info(`执行文件夹 revert: ${normalizedPath}`);
      
      // 先检查文件夹中有多少修改的文件
      const { stdout: statusOutput } = await execAsync(
        `git status --porcelain -- "${normalizedPath}"`,
        {
          cwd: repoRoot,
          encoding: 'utf8'
        }
      );
      
      const modifiedFiles = statusOutput
        .split('\n')
        .filter(line => line.trim().length > 0 && !line.trim().startsWith('??'))
        .length;
      
      if (modifiedFiles === 0) {
        Logger.info('文件夹中没有修改的文件');
        return 0;
      }
      
      // 检测是否支持 git restore
      const useRestore = await this.supportsGitRestore();
      
      let gitCommand: string;
      if (useRestore) {
        gitCommand = `git restore "${normalizedPath}"`;
        Logger.debug('使用 git restore 命令');
      } else {
        gitCommand = `git checkout HEAD -- "${normalizedPath}"`;
        Logger.debug('使用 git checkout 命令 (Git 版本 < 2.23)');
      }
      
      // 使用仓库根目录作为 cwd
      await execAsync(gitCommand, {
        cwd: repoRoot,
        encoding: 'utf8'
      });
      
      Logger.info(`文件夹 revert 成功，已恢复 ${modifiedFiles} 个文件`);
      return modifiedFiles;
    } catch (error: any) {
      const errorMessage = error.message || String(error);
      Logger.error('执行文件夹 revert 失败:', errorMessage);
      throw new Error(`撤销文件夹修改失败: ${errorMessage}`);
    }
  }
}

