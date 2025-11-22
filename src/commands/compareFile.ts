import * as vscode from 'vscode';
import { GitOperations } from '../utils/gitOps';
import { TempFileManager } from '../utils/tempFile';
import { BeyondComparePath } from '../utils/bcPath';
import { Logger } from '../utils/logger';

/**
 * 比较文件与 Git HEAD 命令
 */
export async function compareFileWithHead(uri: vscode.Uri): Promise<void> {
  Logger.info('执行命令: Compare File with Git HEAD');
  Logger.debug('文件路径:', uri.fsPath);

  let tempFilePath: string | null = null;

  try {
    // 显示进度提示
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '正在准备比较...',
        cancellable: false
      },
      async (progress) => {
        // 1. 检查是否在 Git 仓库中
        progress.report({ message: '检查 Git 仓库...' });
        const isInRepo = await GitOperations.isInGitRepo(uri.fsPath);
        if (!isInRepo) {
          throw new Error('当前文件不在 Git 仓库中。');
        }

        // 2. 检查文件是否在版本控制中
        progress.report({ message: '检查文件状态...' });
        const isTracked = await GitOperations.isFileTracked(uri.fsPath);
        if (!isTracked) {
          throw new Error('文件不在 Git 版本控制中，无法比较。');
        }

        // 3. 获取 HEAD 版本的文件内容
        progress.report({ message: '获取 Git HEAD 版本...' });
        const headContent = await GitOperations.getFileContentAtHead(uri.fsPath);

        // 4. 创建临时文件
        progress.report({ message: '创建临时文件...' });
        tempFilePath = await TempFileManager.createTempFile(uri.fsPath, headContent);

        // 5. 启动 Beyond Compare
        progress.report({ message: '启动 Beyond Compare...' });
        
        // 启动 BC 并在关闭时自动清理临时文件
        await BeyondComparePath.launchCompare(tempFilePath, uri.fsPath, async () => {
          Logger.info('Beyond Compare 已关闭，清理临时文件...');
          if (tempFilePath) {
            await TempFileManager.cleanupTempFile(tempFilePath);
          }
        });

        Logger.info('文件比较完成');
      }
    );

    vscode.window.showInformationMessage('Beyond Compare 已启动');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error('比较文件失败:', errorMessage);
    vscode.window.showErrorMessage(`比较文件失败: ${errorMessage}`);

    // 即使失败，临时文件也会在1小时后自动清理
  }
}

