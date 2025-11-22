import * as path from 'path';
import { runTests } from 'vscode-test';

async function main() {
  try {
    // 扩展开发目录路径
    const extensionDevelopmentPath = path.resolve(__dirname, '../../');

    // 测试运行器路径
    const extensionTestsPath = path.resolve(__dirname, './suite/index');

    // 下载 VSCode，解压并运行测试
    await runTests({ extensionDevelopmentPath, extensionTestsPath });
  } catch (err) {
    console.error('测试运行失败');
    process.exit(1);
  }
}

main();

