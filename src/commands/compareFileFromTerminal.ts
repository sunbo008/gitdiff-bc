import * as vscode from 'vscode';
import { compareFileWithHead } from './compareFile';
import { TerminalPathParser } from '../utils/terminalPathParser';
import { Logger } from '../utils/logger';
import { t } from '../utils/i18n';

/**
 * 最大批量比较文件数量（超过此数量需要用户确认）
 */
const MAX_BATCH_FILES_WITHOUT_CONFIRM = 20;

/**
 * 从终端比较文件与 Git HEAD
 * 支持单文件和批量文件比较
 */
export async function compareFileFromTerminal(): Promise<void> {
  Logger.info('执行命令: compareFileFromTerminal');

  try {
    // 1. 获取工作区文件夹
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      vscode.window.showErrorMessage(t('error.noWorkspace') || '没有打开的工作区');
      return;
    }

    // 2. 获取活动终端
    const terminal = vscode.window.activeTerminal;
    if (!terminal) {
      vscode.window.showErrorMessage('没有活动的终端');
      return;
    }

    // 3. 尝试自动复制终端选中的文本
    // 使用 VSCode 内置命令复制终端选区
    await vscode.commands.executeCommand('workbench.action.terminal.copySelection');
    
    // 等待剪贴板更新（给一点缓冲时间）
    await new Promise(resolve => setTimeout(resolve, 200));

    // 4. 读取剪贴板内容
    const clipboardText = await vscode.env.clipboard.readText();
    
    if (clipboardText && clipboardText.trim().length > 0) {
      Logger.info('成功从终端复制文本');
      await compareSingleOrBatchFiles(clipboardText, workspaceFolders);
      return;
    }

    // 5. 如果自动复制失败（例如没有选中文本），回退到手动输入
    // 让用户输入文件路径
    const input = await vscode.window.showInputBox({
      prompt: '未能自动获取选中文本，请粘贴要比较的文件路径',
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
    await compareSingleOrBatchFiles(input, workspaceFolders);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    Logger.error('执行终端比较命令失败:', errorMessage);
    vscode.window.showErrorMessage(`${t('error.compareFailed')}: ${errorMessage}`);
  }
}

/**
 * 比较单个或批量文件（根据文本内容自动判断）
 */
async function compareSingleOrBatchFiles(
  text: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<void> {
  const lines = text.split('\n');
  
  if (lines.length === 1 || lines.filter(l => l.trim().length > 0).length === 1) {
    // 单文件模式
    Logger.info('单文件比较模式');
    await compareSingleFile(text, workspaceFolders);
  } else {
    // 批量模式
    Logger.info('批量文件比较模式');
    await compareBatchFiles(text, workspaceFolders);
  }
}

/**
 * 比较单个文件
 */
async function compareSingleFile(
  text: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<void> {
  // 解析文件路径
  const filePath = TerminalPathParser.parseFilePathFromLine(text);
  
  if (!filePath) {
    vscode.window.showErrorMessage(
      t('error.terminal.noFilePathDetected') || '未检测到有效的文件路径'
    );
    return;
  }

  Logger.info(`解析的文件路径: ${filePath}`);

  // 解析并验证文件路径
  const { uri, reason } = await TerminalPathParser.resolveAndValidateFilePath(filePath, workspaceFolders);
  
  if (!uri) {
    const baseError = t('error.terminal.invalidFilePath') || '无效的文件路径';
    const detailedMessage = reason ? `${baseError}: ${filePath} (${reason})` : `${baseError}: ${filePath}`;
    
    vscode.window.showErrorMessage(detailedMessage);
    return;
  }

  // 调用文件比较命令
  await compareFileWithHead(undefined, uri.fsPath);
}

/**
 * 批量比较文件
 */
async function compareBatchFiles(
  text: string,
  workspaceFolders: readonly vscode.WorkspaceFolder[]
): Promise<void> {
  // 1. 解析所有文件路径
  const relativePaths = TerminalPathParser.parseMultipleFilePaths(text);
  
  if (relativePaths.length === 0) {
    vscode.window.showErrorMessage(
      t('error.terminal.noFilePathDetected') || '未检测到有效的文件路径'
    );
    return;
  }

  Logger.info(`解析了 ${relativePaths.length} 个文件路径`);

  // 2. 解析并验证所有文件路径
  const { validUris, skippedCount } = await TerminalPathParser.resolveAndValidateMultipleFilePaths(
    relativePaths,
    workspaceFolders
  );

  if (validUris.length === 0) {
    vscode.window.showErrorMessage(
      t('error.terminal.noValidFiles') || '未找到有效的文件'
    );
    return;
  }

  Logger.info(`找到 ${validUris.length} 个有效文件`);

  // 3. 如果文件数量超过限制，请求用户确认
  if (validUris.length > MAX_BATCH_FILES_WITHOUT_CONFIRM) {
    const confirmMessage = t('confirm.batchCompare')
      ?.replace('{count}', validUris.length.toString()) ||
      `检测到 ${validUris.length} 个文件，是否继续批量比较？这可能会打开多个 Beyond Compare 窗口`;
    
    const action = await vscode.window.showWarningMessage(
      confirmMessage,
      { modal: true },
      '继续',
      '取消'
    );

    if (action !== '继续') {
      Logger.info('用户取消了批量比较');
      return;
    }
  }

  // 4. 批量比较文件（带进度提示）
  await compareFilesWithProgress(validUris, skippedCount);
}

/**
 * 带进度提示的批量文件比较
 */
async function compareFilesWithProgress(
  uris: vscode.Uri[],
  skippedCount: number
): Promise<void> {
  let successCount = 0;
  let failedCount = 0;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: t('progress.batchCompare') || '批量比较文件',
      cancellable: true
    },
    async (progress, token) => {
      const total = uris.length;

      for (let i = 0; i < uris.length; i++) {
        // 检查是否取消
        if (token.isCancellationRequested) {
          Logger.info(`用户取消批量比较，已比较 ${successCount}/${total} 个文件`);
          break;
        }

        const uri = uris[i];
        const current = i + 1;
        const fileName = uri.fsPath.split('/').pop() || uri.fsPath;

        // 更新进度
        progress.report({
          message: t('progress.comparingFile')
            ?.replace('{current}', current.toString())
            ?.replace('{total}', total.toString())
            ?.replace('{filename}', fileName) ||
            `正在比较第 ${current}/${total} 个文件: ${fileName}`,
          increment: (100 / total)
        });

        try {
          await compareFileWithHead(undefined, uri.fsPath);
          successCount++;
          
          // 添加短暂延迟，避免同时启动过多 BC 窗口
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          Logger.error(`比较文件失败: ${uri.fsPath}`, error);
          failedCount++;
        }
      }
    }
  );

  // 显示摘要信息
  showBatchCompareSummary(successCount, failedCount, skippedCount);
}

/**
 * 显示批量比较摘要信息
 */
function showBatchCompareSummary(
  successCount: number,
  failedCount: number,
  skippedCount: number
): void {
  let message: string;

  if (skippedCount > 0) {
    message = t('success.batchCompareWithSkipped')
      ?.replace('{success}', successCount.toString())
      ?.replace('{skipped}', skippedCount.toString()) ||
      `成功比较 ${successCount} 个文件，跳过 ${skippedCount} 个无效路径`;
  } else {
    message = t('success.batchCompare')
      ?.replace('{success}', successCount.toString()) ||
      `成功比较 ${successCount} 个文件`;
  }

  if (failedCount > 0) {
    message += ` (${failedCount} 个失败)`;
  }

  Logger.info(message);
  vscode.window.showInformationMessage(message);
}





