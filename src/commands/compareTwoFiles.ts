import * as vscode from 'vscode';
import * as fs from 'fs';
import { BeyondComparePath } from '../utils/bcPath';
import { Logger } from '../utils/logger';
import { t } from '../utils/i18n';

/**
 * 比较两个文件的命令模块
 */

// 全局状态：存储第一个选中的文件路径
let firstSelectedFile: string | null = null;

// 状态栏项：显示已选中的文件
let statusBarItem: vscode.StatusBarItem | null = null;

/**
 * 初始化状态栏项
 */
export function initializeStatusBar(context: vscode.ExtensionContext): void {
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.command = 'extension.clearSelectedFile';
  context.subscriptions.push(statusBarItem);
}

/**
 * 更新状态栏显示
 */
function updateStatusBar(): void {
  if (!statusBarItem) {
    return;
  }

  if (firstSelectedFile) {
    const fileName = firstSelectedFile.split(/[\\/]/).pop() || '';
    statusBarItem.text = `$(file) ${fileName}`;
    statusBarItem.tooltip = t('statusBar.clearTooltip');
    statusBarItem.show();
    
    // 设置上下文，控制菜单显示
    vscode.commands.executeCommand('setContext', 'firstFileSelected', true);
  } else {
    statusBarItem.hide();
    vscode.commands.executeCommand('setContext', 'firstFileSelected', false);
  }
}

/**
 * 清除选中的第一个文件
 */
export async function clearSelectedFile(): Promise<void> {
  Logger.info(t('command.executing') + ': clearSelectedFile');
  firstSelectedFile = null;
  updateStatusBar();
  Logger.info(t('info.fileSelectionCleared'));
}

/**
 * 方式1: 比较选中的两个文件（多选直接比较）
 */
export async function compareSelectedFiles(uri: vscode.Uri, uris?: vscode.Uri[]): Promise<void> {
  Logger.info(t('command.executing') + ': compareSelectedFiles');
  
  try {
    // 获取选中的文件列表
    const selectedFiles = uris || [uri];
    Logger.debug(`选中文件数量: ${selectedFiles.length}`);
    
    if (selectedFiles.length !== 2) {
      // 防御性检查（理论上菜单条件已保证选中2个文件）
      Logger.warn(`选中文件数量不是2个: ${selectedFiles.length}`);
      vscode.window.showWarningMessage(t('error.selectExactlyTwoFiles'));
      return;
    }

    const file1 = selectedFiles[0].fsPath;
    const file2 = selectedFiles[1].fsPath;

    Logger.info(`比较文件: ${file1} <-> ${file2}`);

    // 验证文件存在
    if (!fs.existsSync(file1)) {
      throw new Error(t('error.fileNotExist').replace('{file}', file1));
    }
    if (!fs.existsSync(file2)) {
      throw new Error(t('error.fileNotExist').replace('{file}', file2));
    }

    // 显示进度提示
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('progress.launchingBC'),
        cancellable: false
      },
      async () => {
        await BeyondComparePath.launchCompare(file1, file2);
        Logger.info(t('success.compareCompleted'));
      }
    );

    vscode.window.showInformationMessage(t('success.bcLaunched'));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(t('error.compareFailed') + ':', errorMessage);
    vscode.window.showErrorMessage(`${t('error.compareFailed')}: ${errorMessage}`);
  }
}

/**
 * 方式2: 选择第一个文件进行比较
 */
export async function selectFirstFile(uri: vscode.Uri): Promise<void> {
  Logger.info(t('command.executing') + ': selectFirstFile');
  
  try {
    const filePath = uri.fsPath;
    Logger.debug(`选择第一个文件: ${filePath}`);

    // 验证文件存在
    if (!fs.existsSync(filePath)) {
      throw new Error(t('error.fileNotExist').replace('{file}', filePath));
    }

    // 保存第一个文件路径
    firstSelectedFile = filePath;
    updateStatusBar();

    const fileName = filePath.split(/[\\/]/).pop() || '';
    vscode.window.showInformationMessage(
      t('info.firstFileSelected').replace('{file}', fileName)
    );
    
    Logger.info(`第一个文件已选中: ${fileName}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error('选择文件失败:', errorMessage);
    vscode.window.showErrorMessage(errorMessage);
  }
}

/**
 * 方式2: 与已选文件比较
 */
export async function compareWithSelectedFile(uri: vscode.Uri): Promise<void> {
  Logger.info(t('command.executing') + ': compareWithSelectedFile');
  
  try {
    // 防御性检查
    if (!firstSelectedFile) {
      Logger.warn('未选择第一个文件，但命令被执行');
      vscode.window.showWarningMessage(t('error.selectFirstFileFirst'));
      return;
    }

    const file2 = uri.fsPath;
    Logger.debug(`第二个文件: ${file2}`);

    // 检查是否选择了同一个文件
    if (firstSelectedFile === file2) {
      Logger.warn('选择了同一个文件');
      vscode.window.showWarningMessage(t('error.cannotCompareSameFile'));
      return;
    }

    // 验证第一个文件是否还存在
    if (!fs.existsSync(firstSelectedFile)) {
      Logger.error(`第一个文件已不存在: ${firstSelectedFile}`);
      vscode.window.showErrorMessage(t('error.firstFileNotExist'));
      // 清除状态
      await clearSelectedFile();
      return;
    }

    // 验证第二个文件存在
    if (!fs.existsSync(file2)) {
      throw new Error(t('error.fileNotExist').replace('{file}', file2));
    }

    Logger.info(`比较文件: ${firstSelectedFile} <-> ${file2}`);

    // 显示进度提示
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: t('progress.launchingBC'),
        cancellable: false
      },
      async () => {
        await BeyondComparePath.launchCompare(firstSelectedFile!, file2);
        Logger.info(t('success.compareCompleted'));
      }
    );

    vscode.window.showInformationMessage(t('success.bcLaunched'));

    // 比较完成后，自动清除选中状态
    await clearSelectedFile();

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error(t('error.compareFailed') + ':', errorMessage);
    vscode.window.showErrorMessage(`${t('error.compareFailed')}: ${errorMessage}`);
  }
}






