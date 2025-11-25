import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { GitOperations } from './gitOps';
import { Logger } from './logger';

/**
 * 终端路径解析器
 * 从终端输出中提取和解析文件路径
 */
export class TerminalPathParser {
  /**
   * Git status 前缀的正则表达式
   */
  private static readonly GIT_STATUS_PREFIXES = /^(\s*)(modified:|new file:|deleted:|renamed:|typechange:|copied:)(\s+)/;

  /**
   * 文件路径的正则表达式
   * 支持: Unix 路径 (path/to/file), Windows 路径 (C:\path\to\file 或 path\to\file), 包含空格的路径
   * 改进：更好地支持Windows反斜杠路径，使用更宽松的模式
   */
  private static readonly FILE_PATH_PATTERN = /(?:[a-zA-Z]:[\\/])?(?:[^\s:]+[\\/])*[^\s:]+\.[a-zA-Z0-9]+/;

  /**
   * 从单行文本中提取文件路径
   * @param line 终端输出的一行文本
   * @returns 提取的文件路径，如果无法提取则返回 null
   */
  static parseFilePathFromLine(line: string): string | null {
    if (!line || line.trim().length === 0) {
      return null;
    }

    Logger.debug(`解析终端行: "${line}"`);
    Logger.debug(`原始字节表示: ${JSON.stringify(line)}`);

    // 0. 过滤掉明显的错误消息和提示信息
    const trimmedLine = line.trim();
    if (
      trimmedLine.startsWith('无效的文件路径') ||
      trimmedLine.startsWith('文件没有未提交') ||
      trimmedLine.startsWith('错误:') ||
      trimmedLine.startsWith('Error:') ||
      trimmedLine.startsWith('警告:') ||
      trimmedLine.startsWith('Warning:') ||
      trimmedLine.includes('未在工作区中找到') ||
      trimmedLine.includes('not found') ||
      trimmedLine.length > 200 ||  // 文件路径不应该太长
      // 过滤代码语句（包含常见编程关键字或模式）
      /^(import|export|const|let|var|function|class|interface|type|await|async|return|if|for|while)\s/.test(trimmedLine) ||
      trimmedLine.includes('executeCommand') ||
      trimmedLine.includes('vscode.') ||
      /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/.test(trimmedLine)  // 函数调用模式
    ) {
      Logger.debug('跳过非路径文本（错误消息、提示或代码）');
      return null;
    }

    // 1. 清理 git status 前缀
    const cleanedLine = this.cleanGitStatusPrefix(line);
    
    // 2. 去除前后空白
    const trimmed = cleanedLine.trim();
    
    if (trimmed.length === 0) {
      Logger.debug('清理后为空行');
      return null;
    }

    // 3. 提取文件路径
    // 优先尝试匹配文件扩展名模式
    const match = trimmed.match(this.FILE_PATH_PATTERN);
    if (match) {
      const filePath = match[0];
      
      // 额外验证：确保不是代码片段（仅用于警告，不阻止返回）
      if (this.looksLikeCode(filePath)) {
        Logger.warn(`⚠ 匹配的路径可能是代码: "${filePath}"`);
      }
      
      Logger.info(`✓ 正则匹配成功，提取文件路径: "${filePath}"`);
      Logger.info(`  匹配位置: ${match.index}, 原文: "${trimmed}"`);
      return filePath;
    }

    // 4. 如果没有匹配到扩展名，尝试将整行作为路径
    // 去除可能的注释和尾部内容
    Logger.warn(`✗ 正则未匹配，尝试使用整行: "${trimmed}"`);
    const pathCandidate = trimmed.split(/\s*#/)[0].trim();
    if (pathCandidate.length > 0 && !this.looksLikeCode(pathCandidate)) {
      Logger.info(`使用候选路径: "${pathCandidate}"`);
      return pathCandidate;
    }

    Logger.debug('未能提取文件路径');
    return null;
  }

  /**
   * 从多行文本中提取所有文件路径
   * @param text 多行文本（如选中的终端内容）
   * @returns 提取的所有文件路径数组
   */
  static parseMultipleFilePaths(text: string): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    Logger.debug(`解析多行文本，行数: ${text.split('\n').length}`);

    const lines = text.split('\n');
    const filePaths: string[] = [];

    for (const line of lines) {
      const filePath = this.parseFilePathFromLine(line);
      if (filePath) {
        filePaths.push(filePath);
      }
    }

    Logger.debug(`提取了 ${filePaths.length} 个文件路径`);
    return filePaths;
  }

  /**
   * 清理 git status 前缀
   * @param line 包含 git status 前缀的行
   * @returns 清理后的行
   */
  static cleanGitStatusPrefix(line: string): string {
    // 去除 git status 的状态前缀
    return line.replace(this.GIT_STATUS_PREFIXES, '');
  }

  /**
   * 检查字符串是否看起来像代码而非文件路径
   * @param text 待检查的文本
   * @returns 如果看起来像代码返回 true
   */
  private static looksLikeCode(text: string): boolean {
    // 包含函数调用的括号对
    if (/\([^)]*\)/.test(text)) {
      return true;
    }
    
    // 包含引号（字符串字面量）
    if (/['"`]/.test(text)) {
      return true;
    }
    
    // 包含点号连接的多级调用（如 vscode.commands.executeCommand）
    // 但排除文件路径（包含路径分隔符 / 或 \）
    if (/\w+\.\w+\.\w+/.test(text) && !/[/\\]/.test(text)) {
      return true;
    }
    
    // 包含赋值或运算符
    if (/[=<>!+\-*/%&|^]/.test(text)) {
      return true;
    }
    
    return false;
  }

  /**
   * 将相对路径解析为绝对路径 Uri
   * @param relativePath 相对路径
   * @param workspaceFolders 工作区文件夹列表
   * @returns 解析后的 Uri，如果无法解析则返回 null
   */
  static async resolveFilePath(
    relativePath: string,
    workspaceFolders: readonly vscode.WorkspaceFolder[]
  ): Promise<vscode.Uri | null> {
    if (!relativePath || relativePath.trim().length === 0) {
      return null;
    }

    Logger.info(`[resolveFilePath] 开始解析: "${relativePath}"`);
    Logger.info(`[resolveFilePath] 路径信息: isAbsolute=${path.isAbsolute(relativePath)}, platform=${process.platform}`);

    // 1. 如果是绝对路径，直接使用
    if (path.isAbsolute(relativePath)) {
      const uri = vscode.Uri.file(relativePath);
      Logger.info(`[resolveFilePath] ✓ 使用绝对路径: ${uri.fsPath}`);
      return uri;
    }

    // 2. 如果没有工作区，无法解析相对路径
    if (!workspaceFolders || workspaceFolders.length === 0) {
      Logger.warn('[resolveFilePath] ✗ 没有工作区文件夹');
      return null;
    }

    // 3. 在所有工作区中搜索匹配的文件
    Logger.info(`[resolveFilePath] 尝试在 ${workspaceFolders.length} 个工作区中查找`);
    for (const folder of workspaceFolders) {
      const absolutePath = path.join(folder.uri.fsPath, relativePath);
      Logger.info(`[resolveFilePath] 检查路径: ${absolutePath}`);
      
      // 检查文件是否存在
      if (fs.existsSync(absolutePath)) {
        const uri = vscode.Uri.file(absolutePath);
        Logger.info(`[resolveFilePath] ✓ 在工作区中找到文件: ${uri.fsPath}`);
        return uri;
      } else {
        Logger.debug(`[resolveFilePath] 文件不存在: ${absolutePath}`);
      }
    }

    Logger.warn(`[resolveFilePath] ✗ 未在任何工作区中找到文件: ${relativePath}`);
    return null;
  }

  /**
   * 验证文件路径是否有效（存在且在 Git 仓库中）
   * @param uri 文件 Uri
   * @returns 验证结果对象，包含是否有效和失败原因
   */
  static async validateFilePath(uri: vscode.Uri): Promise<{ isValid: boolean; reason?: string }> {
    try {
      const filePath = uri.fsPath;

      // 1. 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        Logger.debug(`文件不存在: ${filePath}`);
        return { isValid: false, reason: '文件不存在' };
      }

      // 2. 检查是否是文件（不是目录）
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        Logger.debug(`路径不是文件: ${filePath}`);
        return { isValid: false, reason: '路径不是文件' };
      }

      // 3. 检查是否在 Git 仓库中
      const isInRepo = await GitOperations.isInGitRepo(filePath);
      if (!isInRepo) {
        Logger.debug(`文件不在 Git 仓库中: ${filePath}`);
        return { isValid: false, reason: '文件不在 Git 仓库中' };
      }

      // 4. 检查文件是否在版本控制中
      const isTracked = await GitOperations.isFileTracked(filePath);
      if (!isTracked) {
        Logger.debug(`文件未纳入 Git 版本控制: ${filePath}`);
        return { isValid: false, reason: '文件未纳入 Git 版本控制' };
      }

      Logger.debug(`文件验证通过: ${filePath}`);
      return { isValid: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      Logger.error('验证文件路径失败:', errorMessage);
      return { isValid: false, reason: `验证过程出错: ${errorMessage}` };
    }
  }

  /**
   * 解析并验证单个文件路径
   * @param relativePath 相对路径
   * @param workspaceFolders 工作区文件夹列表
   * @returns 解析结果对象，包含 Uri 和失败原因
   */
  static async resolveAndValidateFilePath(
    relativePath: string,
    workspaceFolders: readonly vscode.WorkspaceFolder[]
  ): Promise<{ uri: vscode.Uri | null; reason?: string }> {
    const uri = await this.resolveFilePath(relativePath, workspaceFolders);
    if (!uri) {
      return { uri: null, reason: '未在工作区中找到文件' };
    }

    const { isValid, reason } = await this.validateFilePath(uri);
    return isValid ? { uri } : { uri: null, reason };
  }

  /**
   * 批量解析并验证文件路径
   * @param relativePaths 相对路径数组
   * @param workspaceFolders 工作区文件夹列表
   * @returns 有效的文件 Uri 数组和无效路径的统计信息
   */
  static async resolveAndValidateMultipleFilePaths(
    relativePaths: string[],
    workspaceFolders: readonly vscode.WorkspaceFolder[]
  ): Promise<{ validUris: vscode.Uri[]; skippedCount: number }> {
    const validUris: vscode.Uri[] = [];
    let skippedCount = 0;

    for (const relativePath of relativePaths) {
      const { uri } = await this.resolveAndValidateFilePath(relativePath, workspaceFolders);
      if (uri) {
        validUris.push(uri);
      } else {
        skippedCount++;
        Logger.warn(`跳过无效路径: ${relativePath}`);
      }
    }

    Logger.info(`批量解析完成: ${validUris.length} 个有效文件, ${skippedCount} 个无效路径`);
    return { validUris, skippedCount };
  }
}







