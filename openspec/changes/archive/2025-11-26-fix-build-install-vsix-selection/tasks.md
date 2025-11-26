# Implementation Tasks

## 1. 修改脚本 - 添加构建前清理逻辑
- [x] 1.1 在 `scripts/install/build-and-install.sh` 约第 118-120 行之间添加清理逻辑
- [x] 1.2 在 `npm run package` 之前添加 `rm -f dist/*.vsix 2>/dev/null || true`
- [x] 1.3 添加注释说明清理旧 VSIX 文件的原因

## 2. 修改脚本 - 改进文件选择逻辑
- [x] 2.1 修改 `scripts/install/build-and-install.sh` 第 128 行，添加 `-t` 参数到 `ls` 命令
- [x] 2.2 添加注释说明使用 `-t` 参数作为双重保险

## 3. 验证 - 清理逻辑
- [x] 3.1 在 `dist/` 目录中预先放置多个旧版本 VSIX 文件
- [x] 3.2 运行脚本，验证构建前旧文件被删除
- [x] 3.3 验证构建后 `dist/` 目录只有一个最新的 VSIX 文件

## 4. 验证 - 文件选择逻辑（容错测试）
- [x] 4.1 手动在 `dist/` 目录中放置多个 VSIX 文件（模拟清理失败）
- [x] 4.2 运行脚本，验证选择的是最新修改时间的文件
- [x] 4.3 验证脚本在只有单个 VSIX 文件时仍正常工作

## 5. 文档更新
- [x] 5.1 检查 `scripts/README.md` 是否需要更新说明（可能不需要）

