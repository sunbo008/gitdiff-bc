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
  'command.revertFileToHead': string;
  'command.revertFolderToHead': string;
  
  // 进度提示
  'progress.preparing': string;
  'progress.checkingRepo': string;
  'progress.checkingFileStatus': string;
  'progress.gettingHeadVersion': string;
  'progress.creatingTempFile': string;
  'progress.launchingBC': string;
  'progress.batchCompare': string;
  'progress.comparingFile': string;
  'progress.reverting': string;
  'progress.revertingFile': string;
  'progress.revertingFolder': string;
  
  // 成功消息
  'success.bcLaunched': string;
  'success.compareCompleted': string;
  'success.bcClosed': string;
  'success.batchCompare': string;
  'success.batchCompareWithSkipped': string;
  'success.revert.file': string;
  'success.revert.folder': string;
  'success.revert.batch': string;
  'success.revert.batchWithSkipped': string;
  
  // 确认消息
  'confirm.batchCompare': string;
  'confirm.revert.file': string;
  'confirm.revert.folder': string;
  'confirm.revert.batchFiles': string;
  
  // 错误消息
  'error.notInGitRepo': string;
  'error.fileNotTracked': string;
  'error.compareFailed': string;
  'error.folderCompareFailed': string;
  'error.bcNotFound': string;
  'error.selectExactlyTwoFiles': string;
  'error.fileNotExist': string;
  'error.selectFirstFileFirst': string;
  'error.cannotCompareSameFile': string;
  'error.firstFileNotExist': string;
  'error.noWorkspace': string;
  'error.noFileProvided': string;
  'error.noFolderProvided': string;
  'error.terminal.noFilePathDetected': string;
  'error.terminal.invalidFilePath': string;
  'error.terminal.noValidFiles': string;
  'error.revert.fileNotTracked': string;
  'error.revert.failed': string;
  
  // 信息提示
  'info.firstFileSelected': string;
  'info.fileSelectionCleared': string;
  'info.revert.noChanges': string;
  'info.revert.folderNoChanges': string;
  
  // 状态栏
  'statusBar.clearTooltip': string;
  
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
  'command.revertFileToHead': 'Revert File to HEAD',
  'command.revertFolderToHead': 'Revert Folder to HEAD',
  
  // Progress messages
  'progress.preparing': 'Preparing comparison...',
  'progress.checkingRepo': 'Checking Git repository...',
  'progress.checkingFileStatus': 'Checking file status...',
  'progress.gettingHeadVersion': 'Getting Git HEAD version...',
  'progress.creatingTempFile': 'Creating temporary file...',
  'progress.launchingBC': 'Launching Beyond Compare...',
  'progress.batchCompare': 'Batch comparing files',
  'progress.comparingFile': 'Comparing file {current}/{total}: {filename}',
  'progress.reverting': 'Reverting changes...',
  'progress.revertingFile': 'Reverting file...',
  'progress.revertingFolder': 'Reverting folder...',
  
  // Success messages
  'success.bcLaunched': 'Beyond Compare launched',
  'success.compareCompleted': 'Comparison completed',
  'success.bcClosed': 'Beyond Compare closed, cleaning up temporary files...',
  'success.batchCompare': 'Successfully compared {success} files',
  'success.batchCompareWithSkipped': 'Successfully compared {success} files, skipped {skipped} invalid paths',
  'success.revert.file': 'File restored to HEAD version',
  'success.revert.folder': 'Restored {0} files to HEAD version',
  'success.revert.batch': 'Successfully reverted {0} files',
  'success.revert.batchWithSkipped': 'Successfully reverted {0} files, skipped {1} invalid paths',
  
  // Confirmation messages
  'confirm.batchCompare': 'Detected {count} files. Continue batch comparison? This may open multiple Beyond Compare windows.',
  'confirm.revert.file': 'Confirm to discard all uncommitted changes for file "{0}"? This operation cannot be undone.',
  'confirm.revert.folder': 'Confirm to discard all uncommitted changes for folder "{0}" ({1} files)? This operation cannot be undone.',
  'confirm.revert.batchFiles': 'Confirm to revert {0} files? This operation cannot be undone.',
  
  // Error messages
  'error.notInGitRepo': 'Current file is not in a Git repository.',
  'error.fileNotTracked': 'File is not tracked by Git, cannot compare.',
  'error.compareFailed': 'File comparison failed',
  'error.folderCompareFailed': 'Folder comparison failed',
  'error.bcNotFound': 'Beyond Compare not found',
  'error.selectExactlyTwoFiles': 'Please select exactly two files to compare.',
  'error.fileNotExist': 'File does not exist: {file}',
  'error.selectFirstFileFirst': 'Please select the first file to compare first.',
  'error.cannotCompareSameFile': 'Cannot compare the same file.',
  'error.firstFileNotExist': 'The first selected file no longer exists. Please select again.',
  'error.noWorkspace': 'No workspace folder is open',
  'error.noFileProvided': 'No file provided',
  'error.noFolderProvided': 'No folder provided',
  'error.terminal.noFilePathDetected': 'No valid file path detected',
  'error.terminal.invalidFilePath': 'Invalid file path',
  'error.terminal.noValidFiles': 'No valid files found',
  'error.revert.fileNotTracked': 'File is not tracked by Git, cannot revert.',
  'error.revert.failed': 'Revert failed',
  
  // Info messages
  'info.firstFileSelected': 'File selected: {file}. Please select the second file to compare.',
  'info.fileSelectionCleared': 'File selection cleared.',
  'info.revert.noChanges': 'File has no uncommitted changes, no need to revert.',
  'info.revert.folderNoChanges': 'Folder has no uncommitted changes, no need to revert.',
  
  // Status bar
  'statusBar.clearTooltip': 'Click to clear selected file',
  
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
  'command.revertFileToHead': '撤销对文件的修改',
  'command.revertFolderToHead': '撤销对文件夹的修改',
  
  // 进度提示
  'progress.preparing': '正在准备比较...',
  'progress.checkingRepo': '检查 Git 仓库...',
  'progress.checkingFileStatus': '检查文件状态...',
  'progress.gettingHeadVersion': '获取 Git HEAD 版本...',
  'progress.creatingTempFile': '创建临时文件...',
  'progress.launchingBC': '启动 Beyond Compare...',
  'progress.batchCompare': '批量比较文件',
  'progress.comparingFile': '正在比较第 {current}/{total} 个文件: {filename}',
  'progress.reverting': '正在撤销修改...',
  'progress.revertingFile': '正在撤销文件...',
  'progress.revertingFolder': '正在撤销文件夹...',
  
  // 成功消息
  'success.bcLaunched': 'Beyond Compare 已启动',
  'success.compareCompleted': '文件比较完成',
  'success.bcClosed': 'Beyond Compare 已关闭，清理临时文件...',
  'success.batchCompare': '成功比较 {success} 个文件',
  'success.batchCompareWithSkipped': '成功比较 {success} 个文件，跳过 {skipped} 个无效路径',
  'success.revert.file': '文件已恢复到 HEAD 版本',
  'success.revert.folder': '已恢复 {0} 个文件到 HEAD 版本',
  'success.revert.batch': '成功撤销 {0} 个文件的修改',
  'success.revert.batchWithSkipped': '成功撤销 {0} 个文件的修改，跳过 {1} 个无效路径',
  
  // 确认消息
  'confirm.batchCompare': '检测到 {count} 个文件，是否继续批量比较？这可能会打开多个 Beyond Compare 窗口',
  'confirm.revert.file': '确认放弃文件 "{0}" 的所有未提交修改？此操作无法撤销。',
  'confirm.revert.folder': '确认放弃文件夹 "{0}" 中所有未提交的修改（{1} 个文件）？此操作无法撤销。',
  'confirm.revert.batchFiles': '确认撤销 {0} 个文件的修改？此操作无法撤销。',
  
  // 错误消息
  'error.notInGitRepo': '当前文件不在 Git 仓库中。',
  'error.fileNotTracked': '文件不在 Git 版本控制中，无法比较。',
  'error.compareFailed': '比较文件失败',
  'error.folderCompareFailed': '比较文件夹失败',
  'error.bcNotFound': '未找到 Beyond Compare',
  'error.selectExactlyTwoFiles': '请选择恰好两个文件进行比较。',
  'error.fileNotExist': '文件不存在: {file}',
  'error.selectFirstFileFirst': '请先选择第一个文件进行比较。',
  'error.cannotCompareSameFile': '不能比较同一个文件。',
  'error.firstFileNotExist': '第一个选中的文件已不存在，请重新选择。',
  'error.noWorkspace': '没有打开的工作区',
  'error.noFileProvided': '未提供文件',
  'error.noFolderProvided': '未提供文件夹',
  'error.terminal.noFilePathDetected': '未检测到有效的文件路径',
  'error.terminal.invalidFilePath': '无效的文件路径',
  'error.terminal.noValidFiles': '未找到有效的文件',
  'error.revert.fileNotTracked': '文件不在 Git 版本控制中，无法撤销修改。',
  'error.revert.failed': '撤销修改失败',
  
  // 信息提示
  'info.firstFileSelected': '已选择文件: {file}。请选择第二个文件进行比较。',
  'info.fileSelectionCleared': '已清除文件选择。',
  'info.revert.noChanges': '文件没有未提交的修改，无需撤销。',
  'info.revert.folderNoChanges': '文件夹中没有未提交的修改，无需撤销。',
  
  // 状态栏
  'statusBar.clearTooltip': '点击清除选中的文件',
  
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












