import * as vscode from 'vscode';
import * as path from 'path';
import { GitOperations } from '../utils/gitOps';
import { Logger } from '../utils/logger';
import { t, isZhCN } from '../utils/i18n';

/**
 * 撤销文件的修改,恢复到 Git HEAD 版本
 * @param uri 文件的 Uri 对象（从资源管理器传入）
 * @param filePath 可选的文件路径字符串（用于终端场景）
 */
export async function revertFileToHead(uri?: vscode.Uri, filePath?: string): Promise<void> {
  Logger.info(t('command.executing') + ': ' + t('command.revertFileToHead'));
  
  // 如果提供了 filePath，从字符串构造 Uri
  let fileUri: vscode.Uri;
  if (filePath) {
    fileUri = vscode.Uri.file(filePath);
    Logger.debug('从路径字符串构造 Uri:', filePath);
  } else if (uri) {
    fileUri = uri;
  } else {
    const errorMsg = t('error.noFileProvided');
    Logger.error('未提供文件 Uri 或路径');
    throw new Error(errorMsg);
  }
  
  Logger.debug('文件路径:', fileUri.fsPath);

  try {
    // 1. 检查是否在 Git 仓库中
    const isInRepo = await GitOperations.isInGitRepo(fileUri.fsPath);
    if (!isInRepo) {
      vscode.window.showErrorMessage(t('error.notInGitRepo'));
      return;
    }

    // 2. 检查文件是否在版本控制中
    const isTracked = await GitOperations.isFileTracked(fileUri.fsPath);
    if (!isTracked) {
      vscode.window.showErrorMessage(t('error.revert.fileNotTracked'));
      return;
    }

    // 3. 检查文件是否有未提交的修改
    const hasChanges = await GitOperations.hasUncommittedChanges(fileUri.fsPath);
    if (!hasChanges) {
      vscode.window.showInformationMessage(t('info.revert.noChanges'));
      return;
    }

    // 4. 显示确认对话框
    const fileName = path.basename(fileUri.fsPath);
    const confirmMessage = t('confirm.revert.file', fileName);
    const confirmButton = isZhCN() ? '确认' : 'Confirm';
    const cancelButton = isZhCN() ? '取消' : 'Cancel';
    
    const choice = await vscode.window.showWarningMessage(
      confirmMessage,
      { modal: true },
      confirmButton,
      cancelButton
    );

    if (choice !== confirmButton) {
      Logger.info('用户取消了 revert 操作');
      return;
    }

    // 5. 执行 revert 操作
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('progress.reverting'),
        cancellable: false
      },
      async (progress) => {
        progress.report({ message: t('progress.revertingFile') });
        await GitOperations.revertFile(fileUri.fsPath);
        Logger.info(t('success.revert.file'));
      }
    );

    vscode.window.showInformationMessage(t('success.revert.file'));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(t('error.revert.failed') + ':', errorMessage);
    vscode.window.showErrorMessage(`${t('error.revert.failed')}: ${errorMessage}`);
  }
}











