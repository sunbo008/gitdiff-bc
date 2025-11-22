import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { Logger } from './logger';

/**
 * 临时文件管理工具
 */
export class TempFileManager {
  private static tempFiles: Set<string> = new Set();
  
  // 使用固定的临时目录
  private static readonly TEMP_BASE_DIR = path.join(os.tmpdir(), 'gitdiff-bc');
  
  // 临时文件最大保留时间（毫秒）：1小时
  private static readonly MAX_AGE_MS = 60 * 60 * 1000;

  /**
   * 创建临时文件
   */
  static async createTempFile(originalPath: string, content: string): Promise<string> {
    // 确保基础目录存在
    await this.ensureBaseTempDir();
    
    const fileName = path.basename(originalPath);
    const timestamp = Date.now();
    const tempFileName = `file-${timestamp}-${fileName}`;
    const tempFilePath = path.join(this.TEMP_BASE_DIR, tempFileName);

    Logger.debug('创建临时文件:', tempFilePath);

    try {
      await fs.promises.writeFile(tempFilePath, content, 'utf8');
      this.tempFiles.add(tempFilePath);
      Logger.info('临时文件创建成功:', tempFilePath);
      return tempFilePath;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('创建临时文件失败:', errorMessage);
      throw new Error(`创建临时文件失败: ${errorMessage}`);
    }
  }

  /**
   * 清理临时文件
   */
  static async cleanupTempFile(filePath: string): Promise<void> {
    if (!this.tempFiles.has(filePath)) {
      return;
    }

    Logger.debug('清理临时文件:', filePath);

    try {
      await fs.promises.unlink(filePath);
      this.tempFiles.delete(filePath);
      Logger.info('临时文件清理成功:', filePath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.warn('清理临时文件失败（可能已被删除）:', errorMessage);
      // 即使删除失败也从集合中移除
      this.tempFiles.delete(filePath);
    }
  }

  /**
   * 清理所有临时文件
   */
  static async cleanupAll(): Promise<void> {
    Logger.info('清理所有临时文件...');
    const files = Array.from(this.tempFiles);
    
    for (const file of files) {
      await this.cleanupTempFile(file);
    }

    Logger.info(`已清理 ${files.length} 个临时文件`);
  }

  /**
   * 确保基础临时目录存在
   */
  private static async ensureBaseTempDir(): Promise<void> {
    try {
      if (!fs.existsSync(this.TEMP_BASE_DIR)) {
        await fs.promises.mkdir(this.TEMP_BASE_DIR, { recursive: true });
        Logger.info('创建基础临时目录:', this.TEMP_BASE_DIR);
      }
    } catch (error) {
      Logger.error('创建基础临时目录失败:', error);
    }
  }

  /**
   * 创建临时目录（用于文件夹比较）
   */
  static async createTempDir(prefix: string): Promise<string> {
    // 确保基础目录存在
    await this.ensureBaseTempDir();
    
    // 清理旧的临时文件
    await this.cleanupOldFiles();
    
    const timestamp = Date.now();
    const tempDirName = `folder-${prefix}-${timestamp}`;
    const tempDirPath = path.join(this.TEMP_BASE_DIR, tempDirName);

    Logger.debug('创建临时目录:', tempDirPath);

    try {
      await fs.promises.mkdir(tempDirPath, { recursive: true });
      Logger.info('临时目录创建成功:', tempDirPath);
      return tempDirPath;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('创建临时目录失败:', errorMessage);
      throw new Error(`创建临时目录失败: ${errorMessage}`);
    }
  }

  /**
   * 清理旧的临时文件（超过1小时的）
   */
  static async cleanupOldFiles(): Promise<void> {
    try {
      if (!fs.existsSync(this.TEMP_BASE_DIR)) {
        return;
      }

      const files = await fs.promises.readdir(this.TEMP_BASE_DIR);
      const now = Date.now();
      let cleanedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.TEMP_BASE_DIR, file);
        
        try {
          const stats = await fs.promises.stat(filePath);
          const age = now - stats.mtimeMs;

          // 删除超过 MAX_AGE_MS 的文件/目录
          if (age > this.MAX_AGE_MS) {
            if (stats.isDirectory()) {
              await fs.promises.rm(filePath, { recursive: true, force: true });
            } else {
              await fs.promises.unlink(filePath);
            }
            cleanedCount++;
            Logger.debug(`清理旧文件: ${file} (年龄: ${Math.round(age / 1000 / 60)}分钟)`);
          }
        } catch (error) {
          // 忽略单个文件的清理错误
          Logger.debug(`清理文件失败: ${file}`, error);
        }
      }

      if (cleanedCount > 0) {
        Logger.info(`已清理 ${cleanedCount} 个旧的临时文件/目录`);
      }
    } catch (error) {
      Logger.warn('清理旧文件失败:', error);
    }
  }

  /**
   * 获取临时目录路径（用于调试）
   */
  static getTempBaseDir(): string {
    return this.TEMP_BASE_DIR;
  }
  
  /**
   * 清理临时目录
   */
  static async cleanupTempDir(dirPath: string): Promise<void> {
    Logger.debug('清理临时目录:', dirPath);

    try {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
      Logger.info('✓ 临时目录清理成功:', dirPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.warn('清理临时目录失败:', errorMessage);
    }
  }
}

