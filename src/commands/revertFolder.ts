import * as vscode from 'vscode';
import * as path from 'path';
import { GitOperations } from '../utils/gitOps';
import { Logger } from '../utils/logger';
import { t, isZhCN } from '../utils/i18n';

/**
 * 撤销文件夹的修改,恢复到 Git HEAD 版本
 * @param uri 文件夹的 Uri 对象（从资源管理器传入）
 */
export async function revertFolderToHead(uri?: vscode.Uri): Promise<void> {
  Logger.info(t('command.executing') + ': ' + t('command.revertFolderToHead'));
  
  if (!uri) {
    const errorMsg = t('error.noFolderProvided');
    Logger.error('未提供文件夹 Uri');
    vscode.window.showErrorMessage(errorMsg);
    return;
  }
  
  Logger.debug('文件夹路径:', uri.fsPath);

  try {
    // 1. 检查是否在 Git 仓库中
    const isInRepo = await GitOperations.isInGitRepo(uri.fsPath);
    if (!isInRepo) {
      vscode.window.showErrorMessage(t('error.notInGitRepo'));
      return;
    }

    // 2. 检查文件夹中是否有未提交的修改
    const repoRoot = await GitOperations.getRepoRoot(uri.fsPath);
    const relativePath = path.relative(repoRoot, uri.fsPath);
    const normalizedPath = relativePath
      .normalize('NFC')
      .split(path.sep)
      .join('/') || '.';
    
    // 获取修改的文件数量
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const { stdout: statusOutput } = await execAsync(
      `git status --porcelain -- "${normalizedPath}"`,
      {
        cwd: uri.fsPath,
        encoding: 'utf8'
      }
    );
    
    const modifiedFiles = statusOutput
      .split('\n')
      .filter((line: string) => line.trim().length > 0 && !line.trim().startsWith('??'))
      .length;
    
    if (modifiedFiles === 0) {
      vscode.window.showInformationMessage(t('info.revert.folderNoChanges'));
      return;
    }

    // 3. 显示确认对话框
    const folderName = path.basename(uri.fsPath);
    const confirmMessage = t('confirm.revert.folder', folderName, modifiedFiles);
    const confirmButton = isZhCN() ? '确认' : 'Confirm';
    const cancelButton = isZhCN() ? '取消' : 'Cancel';
    
    const choice = await vscode.window.showWarningMessage(
      confirmMessage,
      { modal: true },
      confirmButton,
      cancelButton
    );

    if (choice !== confirmButton) {
      Logger.info('用户取消了文件夹 revert 操作');
      return;
    }

    // 4. 执行 revert 操作
    let revertedCount = 0;
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('progress.reverting'),
        cancellable: false
      },
      async (progress) => {
        progress.report({ message: t('progress.revertingFolder') });
        revertedCount = await GitOperations.revertFolder(uri.fsPath);
        Logger.info(t('success.revert.folder', revertedCount));
      }
    );

    vscode.window.showInformationMessage(t('success.revert.folder', revertedCount));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(t('error.revert.failed') + ':', errorMessage);
    vscode.window.showErrorMessage(`${t('error.revert.failed')}: ${errorMessage}`);
  }
}











