import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { GitOperations } from '../utils/gitOps';
import { TempFileManager } from '../utils/tempFile';
import { BeyondComparePath } from '../utils/bcPath';
import { Logger } from '../utils/logger';

const execAsync = promisify(exec);

/**
 * 比较文件夹与 Git HEAD 命令
 */
export async function compareFolderWithHead(uri: vscode.Uri): Promise<void> {
  Logger.info('执行命令: Compare Folder with Git HEAD');
  Logger.debug('文件夹路径:', uri.fsPath);

  let tempDirPath: string | null = null;

  try {
    // 显示进度提示
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '正在准备文件夹比较...',
        cancellable: false
      },
      async (progress) => {
        // 1. 检查是否在 Git 仓库中
        progress.report({ message: '检查 Git 仓库...' });
        const isInRepo = await GitOperations.isInGitRepo(uri.fsPath);
        if (!isInRepo) {
          throw new Error('当前文件夹不在 Git 仓库中。');
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
        progress.report({ message: '创建临时目录...' });
        tempDirPath = await TempFileManager.createTempDir('folder-compare');
        
        // 4. 导出 HEAD 版本到临时目录
        progress.report({ message: '导出 Git HEAD 版本...' });
        
        Logger.debug(`仓库根目录: ${repoRoot}`);
        Logger.debug(`相对路径: ${normalizedPath || '(根目录)'}`);
        Logger.debug(`临时目录: ${tempDirPath}`);
        
        // 使用 git archive 导出 HEAD 版本
        try {
          // 如果是子文件夹，需要指定路径；如果是根目录，不指定路径
          const pathArg = normalizedPath ? `-- "${normalizedPath}"` : '';
          
          // git archive 会保持原始目录结构，所以我们直接解压到临时目录
          const archiveCmd = `git archive HEAD ${pathArg} | tar -x -C "${tempDirPath}"`;
          
          Logger.debug(`执行命令: ${archiveCmd}`);
          
          const { stdout, stderr } = await execAsync(archiveCmd, {
            cwd: repoRoot,
            shell: '/bin/bash',
            maxBuffer: 50 * 1024 * 1024 // 50MB
          });
          
          if (stderr) {
            Logger.warn('git archive 警告:', stderr);
          }
          
          Logger.info('Git HEAD 版本导出成功');
          
          // 列出临时目录内容用于调试
          const lsResult = await execAsync(`ls -la "${tempDirPath}"`, { shell: '/bin/bash' });
          Logger.debug('临时目录内容:', lsResult.stdout);
          
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
        progress.report({ message: '启动 Beyond Compare...' });
        
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
          Logger.info('Beyond Compare 已关闭，清理临时目录...');
          if (tempDirPath) {
            await TempFileManager.cleanupTempDir(tempDirPath);
          }
        });

        Logger.info('文件夹比较完成 - Beyond Compare 已启动');
      }
    );

    vscode.window.showInformationMessage('Beyond Compare 已启动');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error('比较文件夹失败:', errorMessage);
    vscode.window.showErrorMessage(`比较文件夹失败: ${errorMessage}`);

    // 即使失败，临时目录也会在1小时后自动清理
  }
}

