# Change: 修复构建安装脚本中 VSIX 文件选择逻辑

## Why

`build-and-install.sh` 脚本在安装 VSIX 文件时，使用 `ls dist/gitdiff-bc-*.vsix | head -n 1` 来选择文件。这个逻辑存在问题：

1. **可能选择错误的文件**：如果 `dist/` 目录中存在多个版本的 VSIX 文件，`ls` 默认按字母顺序排序，可能会选择旧版本而非刚构建的最新版本
2. **安装失败风险**：用户可能安装了旧版本而不自知，导致测试结果不准确
3. **违背脚本意图**：脚本名为 "build-and-install"，预期行为应该是安装刚构建的版本，而非任意版本

例如，如果目录中有：
- `gitdiff-bc-0.1.6.vsix` (旧版本)
- `gitdiff-bc-0.1.7.vsix` (刚构建的新版本)

`ls` 会按字母顺序列出 `0.1.6` 在前，导致安装旧版本。

## What Changes

### 变更 1：在构建前清理旧的 VSIX 文件（主要方案）
- 在步骤 3/8 "编译和打包" 中，执行 `npm run package` **之前**，删除 `dist/` 目录中所有现有的 `*.vsix` 文件
- 这样确保构建完成后 `dist/` 目录只包含刚构建的最新版本
- 从根本上避免多个版本文件混淆的问题

修改位置：约在第 118-120 行之间添加：
```bash
# 3. 构建
echo "🔨 [3/8] 编译和打包..."
# 清理旧的 VSIX 文件
rm -f dist/*.vsix 2>/dev/null || true
npm run package
```

### 变更 2：改进 VSIX 文件选择逻辑（保险方案）
- 修改第 128 行的文件选择逻辑
- 使用 `ls -t` 按修改时间倒序排列，确保即使有多个文件也选择最新的
- 作为双重保险，即使清理逻辑失败也能正确选择文件

修改位置：第 128 行：
```bash
# 修改前
VSIX_FILE=$(ls dist/gitdiff-bc-*.vsix 2>/dev/null | head -n 1)

# 修改后
VSIX_FILE=$(ls -t dist/gitdiff-bc-*.vsix 2>/dev/null | head -n 1)
```

## Impact

- **受影响的文件**: `scripts/install/build-and-install.sh`
- **受影响的 specs**: `build-tooling` (新增)
- **用户影响**: ✅ 开发者使用该脚本时将始终安装最新构建的版本，且不会有旧版本文件堆积
- **向后兼容性**: ✅ 完全兼容，仅修复错误行为并改进清理
- **测试要求**: 
  - 手动测试：在 `dist/` 目录中预先放置旧版本 VSIX 文件，验证构建前被正确清理
  - 验证构建后 `dist/` 目录只包含一个最新的 VSIX 文件
  - 验证即使清理失败（如多个文件），仍能正确选择最新的文件

