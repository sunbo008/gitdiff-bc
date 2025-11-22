import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('开始运行测试！');

  test('扩展应该被激活', () => {
    const ext = vscode.extensions.getExtension('your-publisher-name.gitdiff-bc');
    assert.ok(ext);
  });

  test('compareFileWithHead 命令应该被注册', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('extension.compareFileWithHead'));
  });

  test('compareFolderWithHead 命令应该被注册', async () => {
    const commands = await vscode.commands.getCommands();
    assert.ok(commands.includes('extension.compareFolderWithHead'));
  });
});

