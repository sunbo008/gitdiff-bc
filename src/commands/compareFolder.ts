import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { GitOperations } from '../utils/gitOps';
import { TempFileManager } from '../utils/tempFile';
import { BeyondComparePath } from '../utils/bcPath';
import { Logger } from '../utils/logger';
import { t } from '../utils/i18n';

const execAsync = promisify(exec);

/**
 * 比较文件夹与 Git HEAD 命令
 */
export async function compareFolderWithHead(uri: vscode.Uri): Promise<void> {
  Logger.info(t('command.executing') + ': ' + t('command.compareFolderWithHead'));
  Logger.debug('文件夹路径:', uri.fsPath);

  let tempDirPath: string | null = null;

  try {
    // 显示进度提示
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('progress.preparing'),
        cancellable: false
      },
      async (progress) => {
        // 1. 检查是否在 Git 仓库中
        progress.report({ message: t('progress.checkingRepo') });
        const isInRepo = await GitOperations.isInGitRepo(uri.fsPath);
        if (!isInRepo) {
          throw new Error(t('error.notInGitRepo'));
        }

        // 2. 获取 Git 仓库根目录
        progress.report({ message: '分析仓库结构...' });
        const repoRoot = await GitOperations.getRepoRoot(uri.fsPath);
        const relativePath = path.relative(repoRoot, uri.fsPath);
        const normalizedPath = relativePath
          .normalize('NFC')
          .split(path.sep)
          .join('/');
        
        Logger.debug(`准备比较文件夹: ${normalizedPath || '(根目录)'}`);

        // 3. 创建临时目录
        progress.report({ message: t('progress.creatingTempFile') });
        tempDirPath = await TempFileManager.createTempDir('folder-compare');
        
        // 4. 导出 HEAD 版本到临时目录
        progress.report({ message: t('progress.gettingHeadVersion') });
        
        Logger.debug(`仓库根目录: ${repoRoot}`);
        Logger.debug(`相对路径: ${normalizedPath || '(根目录)'}`);
        Logger.debug(`临时目录: ${tempDirPath}`);
        
        // 使用 git archive 导出 HEAD 版本
        try {
          // 如果是子文件夹，需要指定路径；如果是根目录，不指定路径
          const pathArg = normalizedPath ? `-- "${normalizedPath}"` : '';
          
          // 根据操作系统选择不同的命令
          const isWindows = process.platform === 'win32';
          let archiveCmd: string;
          let execOptions: any;
          
          if (isWindows) {
            // Windows: 将路径转换为 Git Bash 风格（正斜杠）
            // 例如: C:\Users\... -> /c/Users/...
            const tempDirPathUnix = tempDirPath
              .replace(/\\/g, '/')  // 反斜杠转为正斜杠
              .replace(/^([A-Z]):/, (_, drive) => `/${drive.toLowerCase()}`);  // C: -> /c
            
            archiveCmd = `git archive HEAD ${pathArg} | tar -x -C "${tempDirPathUnix}"`;
            
            // 在 Windows 上，需要使用 bash 来执行管道命令
            // Git for Windows 会将 bash 添加到 PATH 中
            execOptions = {
              cwd: repoRoot,
              shell: 'bash',  // 使用 bash（不指定完整路径，让系统从 PATH 中查找）
              maxBuffer: 50 * 1024 * 1024 // 50MB
            };
          } else {
            // Unix/Linux/macOS
            archiveCmd = `git archive HEAD ${pathArg} | tar -x -C "${tempDirPath}"`;
            execOptions = {
              cwd: repoRoot,
              maxBuffer: 50 * 1024 * 1024 // 50MB
            };
          }
          
          Logger.debug(`执行命令: ${archiveCmd}`);
          Logger.debug(`操作系统: ${process.platform}`);
          Logger.debug(`工作目录: ${repoRoot}`);
          
          const { stdout, stderr } = await execAsync(archiveCmd, execOptions);
          
          if (stderr) {
            Logger.warn('git archive 警告:', stderr);
          }
          
          Logger.info('Git HEAD 版本导出成功');
          
          // 列出临时目录内容用于调试
          try {
            const files = await fs.promises.readdir(tempDirPath);
            Logger.debug('临时目录内容:', JSON.stringify(files));
          } catch (e) {
            Logger.debug('无法列出临时目录内容');
          }
          
        } catch (error: any) {
          Logger.error('导出 Git HEAD 版本失败:', error);
          Logger.error('错误信息:', error.message);
          Logger.error('错误输出:', error.stderr || '无');
          throw new Error(`导出 Git HEAD 版本失败: ${error.message}`);
        }

        // 5. 确定比较路径
        // git archive 会保持目录结构，所以临时目录中会有完整的路径
        const headFolderPath = normalizedPath 
          ? path.join(tempDirPath, normalizedPath)
          : tempDirPath;
          
        Logger.info(`HEAD 版本路径: ${headFolderPath}`);
        Logger.info(`工作区路径: ${uri.fsPath}`);

        // 检查临时目录是否有内容
        if (!fs.existsSync(headFolderPath)) {
          Logger.error(`HEAD 版本路径不存在: ${headFolderPath}`);
          
          // 列出临时目录以帮助调试
          try {
            const files = await fs.promises.readdir(tempDirPath);
            Logger.error(`临时目录实际内容: ${JSON.stringify(files)}`);
          } catch (e) {
            Logger.error('无法列出临时目录内容');
          }
          
          throw new Error(`HEAD 版本路径不存在: ${headFolderPath}`);
        }
        
        // 验证目录有内容
        const headFiles = await fs.promises.readdir(headFolderPath);
        Logger.info(`HEAD 版本文件数: ${headFiles.length}`);
        if (headFiles.length === 0) {
          throw new Error('HEAD 版本目录为空');
        }

        // 6. 启动 Beyond Compare
        progress.report({ message: t('progress.launchingBC') });
        
        // 确保路径存在且可访问
        try {
          await fs.promises.access(headFolderPath, fs.constants.R_OK);
          await fs.promises.access(uri.fsPath, fs.constants.R_OK);
        } catch (error: any) {
          Logger.error('路径访问检查失败:', error);
          throw new Error(`无法访问路径: ${error.message}`);
        }
        
        Logger.info(`准备启动 Beyond Compare`);
        Logger.info(`  左侧 (HEAD): ${headFolderPath}`);
        Logger.info(`  右侧 (工作区): ${uri.fsPath}`);
        
        // 启动 BC 并在关闭时自动清理临时目录
        await BeyondComparePath.launchCompare(headFolderPath, uri.fsPath, async () => {
          Logger.info(t('success.bcClosed'));
          if (tempDirPath) {
            await TempFileManager.cleanupTempDir(tempDirPath);
          }
        });

        Logger.info(t('success.compareCompleted'));
      }
    );

    vscode.window.showInformationMessage(t('success.bcLaunched'));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(t('error.folderCompareFailed') + ':', errorMessage);
    vscode.window.showErrorMessage(`${t('error.folderCompareFailed')}: ${errorMessage}`);

    // 即使失败，临时目录也会在1小时后自动清理
  }
}

