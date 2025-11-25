import * as vscode from 'vscode';
import { revertFileToHead } from './revertFile';
import { TerminalPathParser } from '../utils/terminalPathParser';
import { Logger } from '../utils/logger';
import { t, isZhCN } from '../utils/i18n';

/**
 * 最大批量 revert 文件数量（超过此数量需要用户确认）
 */
const MAX_BATCH_FILES_WITHOUT_CONFIRM = 20;

/**
 * 从终端撤销文件修改
 * 支持单文件和批量文件 revert
 */
export async function revertFileFromTerminal(): Promise<void> {
  Logger.info('===============================================');
  Logger.info('执行命令: revertFileFromTerminal');
  Logger.info('===============================================');

  try {
    // 1. 获取工作区文件夹
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      Logger.error('没有打开的工作区');
      vscode.window.showErrorMessage(t('error.noWorkspace'));
      return;
    }
    Logger.info(`工作区文件夹: ${workspaceFolders.map(f => f.uri.fsPath).join(', ')}`);

    // 2. 获取活动终端
    const terminal = vscode.window.activeTerminal;
    if (!terminal) {
      Logger.error('没有活动的终端');
      vscode.window.showErrorMessage('没有活动的终端');
      return;
    }
    Logger.info(`活动终端: ${terminal.name}`);

    // 3. 尝试自动复制终端选中的文本
    // 使用 VSCode 内置命令复制终端选区
    await vscode.commands.executeCommand('workbench.action.terminal.copySelection');
    
    // 等待剪贴板更新（给一点缓冲时间）
    await new Promise(resolve => setTimeout(resolve, 200));

    // 4. 读取剪贴板内容
    Logger.info('读取剪贴板内容');
    const clipboardText = await vscode.env.clipboard.readText();
    Logger.info(`剪贴板内容: ${clipboardText}`);
    
    if (clipboardText && clipboardText.trim().length > 0) {
      Logger.info('成功从终端复制文本');
      await revertSingleOrBatchFiles(clipboardText, workspaceFolders);
      return;
    }

    // 5. 如果自动复制失败（例如没有选中文本），回退到手动输入
    const input = await vscode.window.showInputBox({
      prompt: '未能自动获取选中文本，请粘贴要撤销的文件路径',
      placeHolder: '例如: src/commands/compareFile.ts',
      validateInput: (value) => {
        if (!value || value.trim().length === 0) {
          return '请输入文件路径';
        }
        return null;
      }
    });

    if (!input) {
      Logger.info('用户取消了输入');
      return;
    }

    // 6. 根据输入内容判断单文件或批量模式
    await revertSingleOrBatchFiles(input, workspaceFolders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error('执行终端 revert 命令失败:', errorMessage);
    vscode.window.showErrorMessage(`${t('error.revert.failed')}: ${errorMessage}`);
  }
}

/**
 * 撤销单个或批量文件（根据文本内容自动判断）
 */
async function revertSingleOrBatchFiles(
  text: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<void> {
  const lines = text.split('\n');
  
  if (lines.length === 1 || lines.filter(l => l.trim().length > 0).length === 1) {
    // 单文件模式
    Logger.info('单文件 revert 模式');
    await revertSingleFile(text, workspaceFolders);
  } else {
    // 批量模式
    Logger.info('批量文件 revert 模式');
    await revertBatchFiles(text, workspaceFolders);
  }
}

/**
 * 撤销单个文件
 */
async function revertSingleFile(
  text: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<void> {
  // 解析文件路径
  const filePath = TerminalPathParser.parseFilePathFromLine(text);
  
  if (!filePath) {
    vscode.window.showErrorMessage(t('error.terminal.noFilePathDetected'));
    return;
  }

  Logger.info(`解析的文件路径: ${filePath}`);

  // 解析并验证文件路径
  const { uri, reason } = await TerminalPathParser.resolveAndValidateFilePath(filePath, workspaceFolders);
  
  if (!uri) {
    const baseError = t('error.terminal.invalidFilePath');
    const detailedMessage = reason ? `${baseError}: ${filePath} (${reason})` : `${baseError}: ${filePath}`;
    
    vscode.window.showErrorMessage(detailedMessage);
    return;
  }

  // 调用文件 revert 命令
  await revertFileToHead(undefined, uri.fsPath);
}

/**
 * 批量撤销文件
 */
async function revertBatchFiles(
  text: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<void> {
  // 1. 解析所有文件路径
  const relativePaths = TerminalPathParser.parseMultipleFilePaths(text);
  
  if (relativePaths.length === 0) {
    vscode.window.showErrorMessage(t('error.terminal.noFilePathDetected'));
    return;
  }

  Logger.info(`解析了 ${relativePaths.length} 个文件路径`);

  // 2. 解析并验证所有文件路径
  const { validUris, skippedCount } = await TerminalPathParser.resolveAndValidateMultipleFilePaths(
    relativePaths,
    workspaceFolders
  );

  if (validUris.length === 0) {
    vscode.window.showErrorMessage(t('error.terminal.noValidFiles'));
    return;
  }

  Logger.info(`找到 ${validUris.length} 个有效文件`);

  // 3. 显示确认对话框
  const confirmMessage = t('confirm.revert.batchFiles', validUris.length);
  const detailText = validUris.map(uri => uri.fsPath).join('\n');
  
  const confirmButton = isZhCN() ? '确认' : 'Confirm';
  const cancelButton = isZhCN() ? '取消' : 'Cancel';
  
  const choice = await vscode.window.showWarningMessage(
    confirmMessage + '\n\n' + (validUris.length <= 20 ? detailText : `${validUris.slice(0, 20).map(u => u.fsPath).join('\n')}\n...还有 ${validUris.length - 20} 个文件`),
    { modal: true },
    confirmButton,
    cancelButton
  );

  if (choice !== confirmButton) {
    Logger.info('用户取消了批量 revert');
    return;
  }

  // 4. 批量撤销文件（带进度提示）
  await revertFilesWithProgress(validUris, skippedCount);
}

/**
 * 带进度提示的批量文件撤销
 */
async function revertFilesWithProgress(
  uris: vscode.Uri[],
  skippedCount: number
): Promise<void> {
  let successCount = 0;
  let failedCount = 0;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: t('progress.reverting'),
      cancellable: true
    },
    async (progress, token) => {
      const total = uris.length;

      for (let i = 0; i < uris.length; i++) {
        // 检查是否取消
        if (token.isCancellationRequested) {
          Logger.info(`用户取消批量 revert，已处理 ${successCount}/${total} 个文件`);
          break;
        }

        const uri = uris[i];
        const current = i + 1;
        const fileName = uri.fsPath.split('/').pop() || uri.fsPath;

        // 更新进度
        progress.report({
          message: t('progress.revertingFile', current, total, fileName),
          increment: (100 / total)
        });

        try {
          await revertFileToHead(undefined, uri.fsPath);
          successCount++;
          
          // 添加短暂延迟
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          Logger.error(`撤销文件失败: ${uri.fsPath}`, error);
          failedCount++;
        }
      }
    }
  );

  // 显示摘要信息
  showBatchRevertSummary(successCount, failedCount, skippedCount);
}

/**
 * 显示批量 revert 摘要信息
 */
function showBatchRevertSummary(
  successCount: number,
  failedCount: number,
  skippedCount: number
): void {
  let message: string;

  if (skippedCount > 0) {
    message = t('success.revert.batchWithSkipped', successCount, skippedCount);
  } else {
    message = t('success.revert.batch', successCount);
  }

  if (failedCount > 0) {
    message += ` (${failedCount} 个失败)`;
  }

  Logger.info(message);
  vscode.window.showInformationMessage(message);
}








