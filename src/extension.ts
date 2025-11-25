import * as vscode from 'vscode';
import { compareFileWithHead } from './commands/compareFile';
import { compareFolderWithHead } from './commands/compareFolder';
import { 
  compareSelectedFiles, 
  selectFirstFile, 
  compareWithSelectedFile,
  clearSelectedFile,
  initializeStatusBar 
} from './commands/compareTwoFiles';
import { compareFileFromTerminal } from './commands/compareFileFromTerminal';
import { revertFileToHead } from './commands/revertFile';
import { revertFolderToHead } from './commands/revertFolder';
import { revertFileFromTerminal } from './commands/revertFileFromTerminal';
import { Logger } from './utils/logger';
import { TempFileManager } from './utils/tempFile';
import { t } from './utils/i18n';

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
  try {
    // 初始化日志记录器（必须最先执行）
    Logger.initialize(context);
    
    // 初始化状态栏
    initializeStatusBar(context);
    
    Logger.info(t('extension.activating'));
    Logger.info(`扩展 ID: gitdiff-bc`);
    Logger.info(`扩展路径: ${context.extensionPath}`);
    Logger.info(`工作区文件夹: ${vscode.workspace.workspaceFolders?.map(f => f.uri.fsPath).join(', ') || '无'}`);
    
    // 注册命令：比较文件
    Logger.debug('注册命令: extension.compareFileWithHead');
    const compareFileCommand = vscode.commands.registerCommand(
      'extension.compareFileWithHead',
      async (uri: vscode.Uri) => {
        try {
          Logger.info(`执行命令: compareFileWithHead, 文件: ${uri?.fsPath || '未提供'}`);
          await compareFileWithHead(uri);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行比较文件命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.compareFileWithHead');

    // 注册命令：比较文件夹
    Logger.debug('注册命令: extension.compareFolderWithHead');
    const compareFolderCommand = vscode.commands.registerCommand(
      'extension.compareFolderWithHead',
      async (uri: vscode.Uri) => {
        try {
          Logger.info(`执行命令: compareFolderWithHead, 文件夹: ${uri?.fsPath || '未提供'}`);
          await compareFolderWithHead(uri);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行比较文件夹命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.compareFolderWithHead');

    // 注册命令：比较选中的两个文件（方式1）
    Logger.debug('注册命令: extension.compareSelectedFiles');
    const compareSelectedFilesCommand = vscode.commands.registerCommand(
      'extension.compareSelectedFiles',
      async (uri: vscode.Uri, uris?: vscode.Uri[]) => {
        try {
          Logger.info(`执行命令: compareSelectedFiles, 选中文件数: ${uris?.length || 1}`);
          await compareSelectedFiles(uri, uris);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行比较选中文件命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.compareSelectedFiles');

    // 注册命令：选择第一个文件进行比较（方式2）
    Logger.debug('注册命令: extension.selectFirstFile');
    const selectFirstFileCommand = vscode.commands.registerCommand(
      'extension.selectFirstFile',
      async (uri: vscode.Uri) => {
        try {
          Logger.info(`执行命令: selectFirstFile, 文件: ${uri?.fsPath || '未提供'}`);
          await selectFirstFile(uri);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行选择第一个文件命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.selectFirstFile');

    // 注册命令：与已选文件比较（方式2）
    Logger.debug('注册命令: extension.compareWithSelectedFile');
    const compareWithSelectedFileCommand = vscode.commands.registerCommand(
      'extension.compareWithSelectedFile',
      async (uri: vscode.Uri) => {
        try {
          Logger.info(`执行命令: compareWithSelectedFile, 文件: ${uri?.fsPath || '未提供'}`);
          await compareWithSelectedFile(uri);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行与已选文件比较命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.compareWithSelectedFile');

    // 注册命令：清除选中的文件
    Logger.debug('注册命令: extension.clearSelectedFile');
    const clearSelectedFileCommand = vscode.commands.registerCommand(
      'extension.clearSelectedFile',
      async () => {
        try {
          Logger.info('执行命令: clearSelectedFile');
          await clearSelectedFile();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行清除选中文件命令失败:', errorMessage);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.clearSelectedFile');

    // 注册命令：从终端比较文件
    Logger.debug('注册命令: extension.compareFileFromTerminal');
    const compareFileFromTerminalCommand = vscode.commands.registerCommand(
      'extension.compareFileFromTerminal',
      async () => {
        try {
          Logger.info('执行命令: compareFileFromTerminal');
          await compareFileFromTerminal();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行从终端比较文件命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.compareFileFromTerminal');

    // 注册命令：撤销文件修改
    Logger.debug('注册命令: extension.revertFileToHead');
    const revertFileCommand = vscode.commands.registerCommand(
      'extension.revertFileToHead',
      async (uri: vscode.Uri) => {
        try {
          Logger.info(`执行命令: revertFileToHead, 文件: ${uri?.fsPath || '未提供'}`);
          await revertFileToHead(uri);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行撤销文件修改命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.revertFileToHead');

    // 注册命令：撤销文件夹修改
    Logger.debug('注册命令: extension.revertFolderToHead');
    const revertFolderCommand = vscode.commands.registerCommand(
      'extension.revertFolderToHead',
      async (uri: vscode.Uri) => {
        try {
          Logger.info(`执行命令: revertFolderToHead, 文件夹: ${uri?.fsPath || '未提供'}`);
          await revertFolderToHead(uri);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行撤销文件夹修改命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.revertFolderToHead');

    // 注册命令：从终端撤销文件修改
    Logger.debug('注册命令: extension.revertFileFromTerminal');
    const revertFileFromTerminalCommand = vscode.commands.registerCommand(
      'extension.revertFileFromTerminal',
      async () => {
        try {
          Logger.info('执行命令: revertFileFromTerminal');
          await revertFileFromTerminal();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          Logger.error('执行从终端撤销文件修改命令失败:', errorMessage);
          vscode.window.showErrorMessage(`${t('extension.commandExecutionFailed')}: ${errorMessage}`);
        }
      }
    );
    Logger.debug(t('extension.commandRegistered') + ': extension.revertFileFromTerminal');

    // 监听配置变化
    const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('beyondCompare')) {
        Logger.info(t('config.updated'));
        Logger.updateLogLevel();
      }
    });

    // 添加到订阅列表
    context.subscriptions.push(
      compareFileCommand,
      compareFolderCommand,
      compareSelectedFilesCommand,
      selectFirstFileCommand,
      compareWithSelectedFileCommand,
      clearSelectedFileCommand,
      compareFileFromTerminalCommand,
      revertFileCommand,
      revertFolderCommand,
      revertFileFromTerminalCommand,
      configWatcher
    );

    Logger.info(t('extension.allCommandsRegistered'));
    Logger.info(t('extension.activated'));
    
    // 异步验证命令（不阻塞激活）
    setImmediate(() => {
      vscode.commands.getCommands(true).then(
        (commands) => {
          const ourCommands = commands.filter(cmd => 
            cmd.startsWith('extension.compare')
          );
          Logger.info(`已注册的扩展命令: ${ourCommands.join(', ')}`);
        },
        (err: any) => {
          Logger.error('获取命令列表失败:', err);
        }
      );
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    console.error('扩展激活失败:', error);
    Logger.error('!!! 扩展激活过程中发生错误 !!!', errorMessage);
    if (stack) {
      Logger.error('错误堆栈:', stack);
    }
    vscode.window.showErrorMessage(`${t('extension.activationFailed')}: ${errorMessage}`);
    // 不要抛出错误，让扩展继续尝试激活
  }
}

/**
 * 扩展停用时调用
 */
export async function deactivate() {
  Logger.info(t('extension.deactivating'));
  
  // 清理所有临时文件
  await TempFileManager.cleanupAll();
  
  Logger.info(t('extension.deactivated'));
}

