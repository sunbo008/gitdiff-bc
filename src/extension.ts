import * as vscode from 'vscode';
import { compareFileWithHead } from './commands/compareFile';
import { compareFolderWithHead } from './commands/compareFolder';
import { Logger } from './utils/logger';
import { TempFileManager } from './utils/tempFile';

/**
 * 扩展激活时调用
 */
export function activate(context: vscode.ExtensionContext) {
  try {
    // 初始化日志记录器（必须最先执行）
    Logger.initialize(context);
    
    Logger.info('=== Beyond Compare Git 扩展开始激活 ===');
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
          vscode.window.showErrorMessage(`执行命令失败: ${errorMessage}`);
        }
      }
    );
    Logger.debug('✓ 命令已注册: extension.compareFileWithHead');

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
          vscode.window.showErrorMessage(`执行命令失败: ${errorMessage}`);
        }
      }
    );
    Logger.debug('✓ 命令已注册: extension.compareFolderWithHead');

    // 注册命令：显示日志文件
    Logger.debug('注册命令: extension.showLogFile');
    const showLogFileCommand = vscode.commands.registerCommand(
      'extension.showLogFile',
      () => {
        Logger.showLogFile();
      }
    );
    Logger.debug('✓ 命令已注册: extension.showLogFile');

    // 注册命令：打开日志目录
    Logger.debug('注册命令: extension.openLogDirectory');
    const openLogDirCommand = vscode.commands.registerCommand(
      'extension.openLogDirectory',
      () => {
        Logger.openLogDirectory();
      }
    );
    Logger.debug('✓ 命令已注册: extension.openLogDirectory');

    // 监听配置变化
    const configWatcher = vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('beyondCompare')) {
        Logger.info('配置已更新');
        Logger.updateLogLevel();
      }
    });

    // 添加到订阅列表
    context.subscriptions.push(
      compareFileCommand,
      compareFolderCommand,
      showLogFileCommand,
      openLogDirCommand,
      configWatcher
    );

    Logger.info('✓ 所有命令已注册完成');
    Logger.info('=== Beyond Compare Git 扩展激活完成 ===');
    
    // 异步验证命令（不阻塞激活）
    setImmediate(() => {
      vscode.commands.getCommands(true).then(
        (commands) => {
          const ourCommands = commands.filter(cmd => 
            cmd.startsWith('extension.compare') || 
            cmd.startsWith('extension.showLog') || 
            cmd.startsWith('extension.openLog')
          );
          Logger.info(`已注册的扩展命令: ${ourCommands.join(', ')}`);
          Logger.info(`日志文件位置: ${Logger.getLogFilePath() || '初始化中...'}`);
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
    vscode.window.showErrorMessage(`Beyond Compare Git 扩展激活失败: ${errorMessage}`);
    // 不要抛出错误，让扩展继续尝试激活
  }
}

/**
 * 扩展停用时调用
 */
export async function deactivate() {
  Logger.info('Beyond Compare Git 扩展正在停用...');
  
  // 清理所有临时文件
  await TempFileManager.cleanupAll();
  
  Logger.info('Beyond Compare Git 扩展已停用');
}

