import * as vscode from 'vscode';

/**
 * 国际化消息定义
 */
interface Messages {
  // 扩展激活相关
  'extension.activating': string;
  'extension.activated': string;
  'extension.deactivating': string;
  'extension.deactivated': string;
  'extension.commandRegistered': string;
  'extension.allCommandsRegistered': string;
  'extension.activationFailed': string;
  'extension.commandExecutionFailed': string;
  
  // 命令执行相关
  'command.executing': string;
  'command.compareFileWithHead': string;
  'command.compareFolderWithHead': string;
  
  // 进度提示
  'progress.preparing': string;
  'progress.checkingRepo': string;
  'progress.checkingFileStatus': string;
  'progress.gettingHeadVersion': string;
  'progress.creatingTempFile': string;
  'progress.launchingBC': string;
  
  // 成功消息
  'success.bcLaunched': string;
  'success.compareCompleted': string;
  'success.bcClosed': string;
  
  // 错误消息
  'error.notInGitRepo': string;
  'error.fileNotTracked': string;
  'error.compareFailed': string;
  'error.folderCompareFailed': string;
  'error.bcNotFound': string;
  
  // 配置相关
  'config.updated': string;
}

/**
 * 英文消息
 */
const en: Messages = {
  // Extension activation
  'extension.activating': '=== Beyond Compare Git extension is activating ===',
  'extension.activated': '=== Beyond Compare Git extension activated ===',
  'extension.deactivating': 'Beyond Compare Git extension is deactivating...',
  'extension.deactivated': 'Beyond Compare Git extension deactivated',
  'extension.commandRegistered': '✓ Command registered',
  'extension.allCommandsRegistered': '✓ All commands registered',
  'extension.activationFailed': 'Beyond Compare Git extension activation failed',
  'extension.commandExecutionFailed': 'Command execution failed',
  
  // Command execution
  'command.executing': 'Executing command',
  'command.compareFileWithHead': 'Compare File with Git HEAD',
  'command.compareFolderWithHead': 'Compare Folder with Git HEAD',
  
  // Progress messages
  'progress.preparing': 'Preparing comparison...',
  'progress.checkingRepo': 'Checking Git repository...',
  'progress.checkingFileStatus': 'Checking file status...',
  'progress.gettingHeadVersion': 'Getting Git HEAD version...',
  'progress.creatingTempFile': 'Creating temporary file...',
  'progress.launchingBC': 'Launching Beyond Compare...',
  
  // Success messages
  'success.bcLaunched': 'Beyond Compare launched',
  'success.compareCompleted': 'Comparison completed',
  'success.bcClosed': 'Beyond Compare closed, cleaning up temporary files...',
  
  // Error messages
  'error.notInGitRepo': 'Current file is not in a Git repository.',
  'error.fileNotTracked': 'File is not tracked by Git, cannot compare.',
  'error.compareFailed': 'File comparison failed',
  'error.folderCompareFailed': 'Folder comparison failed',
  'error.bcNotFound': 'Beyond Compare not found',
  
  // Configuration
  'config.updated': 'Configuration updated'
};

/**
 * 中文消息
 */
const zhCN: Messages = {
  // 扩展激活
  'extension.activating': '=== Beyond Compare Git 扩展开始激活 ===',
  'extension.activated': '=== Beyond Compare Git 扩展激活完成 ===',
  'extension.deactivating': 'Beyond Compare Git 扩展正在停用...',
  'extension.deactivated': 'Beyond Compare Git 扩展已停用',
  'extension.commandRegistered': '✓ 命令已注册',
  'extension.allCommandsRegistered': '✓ 所有命令已注册完成',
  'extension.activationFailed': 'Beyond Compare Git 扩展激活失败',
  'extension.commandExecutionFailed': '执行命令失败',
  
  // 命令执行
  'command.executing': '执行命令',
  'command.compareFileWithHead': '与 Git HEAD 比较文件',
  'command.compareFolderWithHead': '与 Git HEAD 比较文件夹',
  
  // 进度提示
  'progress.preparing': '正在准备比较...',
  'progress.checkingRepo': '检查 Git 仓库...',
  'progress.checkingFileStatus': '检查文件状态...',
  'progress.gettingHeadVersion': '获取 Git HEAD 版本...',
  'progress.creatingTempFile': '创建临时文件...',
  'progress.launchingBC': '启动 Beyond Compare...',
  
  // 成功消息
  'success.bcLaunched': 'Beyond Compare 已启动',
  'success.compareCompleted': '文件比较完成',
  'success.bcClosed': 'Beyond Compare 已关闭，清理临时文件...',
  
  // 错误消息
  'error.notInGitRepo': '当前文件不在 Git 仓库中。',
  'error.fileNotTracked': '文件不在 Git 版本控制中，无法比较。',
  'error.compareFailed': '比较文件失败',
  'error.folderCompareFailed': '比较文件夹失败',
  'error.bcNotFound': '未找到 Beyond Compare',
  
  // 配置
  'config.updated': '配置已更新'
};

/**
 * 获取当前语言的消息包
 */
function getMessages(): Messages {
  const locale = vscode.env.language.toLowerCase();
  
  // 支持中文的所有变体
  if (locale.startsWith('zh')) {
    return zhCN;
  }
  
  // 默认英文
  return en;
}

/**
 * 获取本地化消息
 * @param key 消息键
 * @param args 可选的替换参数
 */
export function t(key: keyof Messages, ...args: any[]): string {
  const messages = getMessages();
  let message = messages[key] || key;
  
  // 简单的参数替换 {0}, {1}, etc.
  args.forEach((arg, index) => {
    message = message.replace(`{${index}}`, String(arg));
  });
  
  return message;
}

/**
 * 获取当前语言代码
 */
export function getLocale(): string {
  return vscode.env.language;
}

/**
 * 是否为中文环境
 */
export function isZhCN(): boolean {
  return vscode.env.language.toLowerCase().startsWith('zh');
}





