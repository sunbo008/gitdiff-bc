import * as path from 'path';
import * as Mocha from 'mocha';
import { glob as globCallback } from 'glob';

export function run(): Promise<void> {
  // 创建 mocha 测试运行器
  const mocha = new Mocha.default({
    ui: 'tdd',
    color: true
  });

  const testsRoot = path.resolve(__dirname, '..');

  return new Promise((resolve, reject) => {
    globCallback('**/**.test.js', { cwd: testsRoot }, (err: Error | null, files: string[]) => {
      if (err) {
        return reject(err);
      }

      // 添加测试文件到测试套件
      files.forEach((f: string) => mocha.addFile(path.resolve(testsRoot, f)));

      try {
        // 运行测试
        mocha.run((failures: number) => {
          if (failures > 0) {
            reject(new Error(`${failures} 个测试失败`));
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}

