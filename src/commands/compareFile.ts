import * as vscode from 'vscode';
import { GitOperations } from '../utils/gitOps';
import { TempFileManager } from '../utils/tempFile';
import { BeyondComparePath } from '../utils/bcPath';
import { Logger } from '../utils/logger';
import { t } from '../utils/i18n';

/**
 * 比较文件与 Git HEAD 命令
 */
export async function compareFileWithHead(uri: vscode.Uri): Promise<void> {
  Logger.info(t('command.executing') + ': ' + t('command.compareFileWithHead'));
  Logger.debug('文件路径:', uri.fsPath);

  let tempFilePath: string | null = null;

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

        // 2. 检查文件是否在版本控制中
        progress.report({ message: t('progress.checkingFileStatus') });
        const isTracked = await GitOperations.isFileTracked(uri.fsPath);
        if (!isTracked) {
          throw new Error(t('error.fileNotTracked'));
        }

        // 3. 获取 HEAD 版本的文件内容
        progress.report({ message: t('progress.gettingHeadVersion') });
        const headContent = await GitOperations.getFileContentAtHead(uri.fsPath);

        // 4. 创建临时文件
        progress.report({ message: t('progress.creatingTempFile') });
        tempFilePath = await TempFileManager.createTempFile(uri.fsPath, headContent);

        // 5. 启动 Beyond Compare
        progress.report({ message: t('progress.launchingBC') });
        
        // 启动 BC 并在关闭时自动清理临时文件
        await BeyondComparePath.launchCompare(tempFilePath, uri.fsPath, async () => {
          Logger.info(t('success.bcClosed'));
          if (tempFilePath) {
            await TempFileManager.cleanupTempFile(tempFilePath);
          }
        });

        Logger.info(t('success.compareCompleted'));
      }
    );

    vscode.window.showInformationMessage(t('success.bcLaunched'));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(t('error.compareFailed') + ':', errorMessage);
    vscode.window.showErrorMessage(`${t('error.compareFailed')}: ${errorMessage}`);

    // 即使失败，临时文件也会在1小时后自动清理
  }
}

