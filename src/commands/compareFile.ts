import * as vscode from 'vscode';
import { GitOperations } from '../utils/gitOps';
import { TempFileManager } from '../utils/tempFile';
import { BeyondComparePath } from '../utils/bcPath';
import { Logger } from '../utils/logger';
import { t } from '../utils/i18n';

/**
 * 比较文件与 Git HEAD 命令
 * @param uri 文件的 Uri 对象（从资源管理器或终端传入）
 * @param filePath 可选的文件路径字符串（用于终端场景）
 */
export async function compareFileWithHead(uri?: vscode.Uri, filePath?: string): Promise<void> {
  Logger.info(t('command.executing') + ': ' + t('command.compareFileWithHead'));
  
  // 如果提供了 filePath，从字符串构造 Uri
  let fileUri: vscode.Uri;
  if (filePath) {
    fileUri = vscode.Uri.file(filePath);
    Logger.debug('从路径字符串构造 Uri:', filePath);
  } else if (uri) {
    fileUri = uri;
  } else {
    const errorMsg = t('error.noFileProvided') || '未提供文件';
    Logger.error('未提供文件 Uri 或路径');
    throw new Error(errorMsg);
  }
  
  Logger.debug('文件路径:', fileUri.fsPath);

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
        const isInRepo = await GitOperations.isInGitRepo(fileUri.fsPath);
        if (!isInRepo) {
          throw new Error(t('error.notInGitRepo'));
        }

        // 2. 检查文件是否在版本控制中
        progress.report({ message: t('progress.checkingFileStatus') });
        const isTracked = await GitOperations.isFileTracked(fileUri.fsPath);
        if (!isTracked) {
          throw new Error(t('error.fileNotTracked'));
        }

        // 3. 获取 HEAD 版本的文件内容
        progress.report({ message: t('progress.gettingHeadVersion') });
        const headContent = await GitOperations.getFileContentAtHead(fileUri.fsPath);

        // 4. 创建临时文件
        progress.report({ message: t('progress.creatingTempFile') });
        tempFilePath = await TempFileManager.createTempFile(fileUri.fsPath, headContent);

        // 5. 启动 Beyond Compare
        progress.report({ message: t('progress.launchingBC') });
        
        // 启动 BC 并在关闭时自动清理临时文件
        await BeyondComparePath.launchCompare(tempFilePath, fileUri.fsPath, async () => {
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

