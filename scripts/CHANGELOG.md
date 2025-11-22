# 脚本更新日志

## 2024-11-22 - 适配新构建规则

### 🔄 主要变更

1. **更新 VSIX 文件路径**
   - 从根目录移动到 `dist/` 目录
   - 所有脚本使用 `dist/gitdiff-bc-*.vsix` 通配符匹配

2. **自动路径检测**
   - 脚本自动检测项目根目录
   - 可从任意位置运行，无需 cd 到特定目录

3. **新增脚本**
   - `build-and-install.sh` - 一键构建并安装（推荐使用）

### 📝 更新的文件

#### `scripts/install/quick-reinstall.sh`
- ✅ 使用通配符 `dist/gitdiff-bc-*.vsix` 而不是硬编码版本号
- ✅ 自动检测项目根目录
- ✅ 添加 VSIX 文件存在性检查
- ✅ 更好的错误提示

#### `scripts/install/build-and-install.sh` (新增)
- ✅ 自动运行 `npm run package` 构建
- ✅ 使用通配符匹配 VSIX 文件
- ✅ 完整的构建+安装流程
- ✅ 适合开发调试使用

#### `scripts/README.md`
- ✅ 更新所有路径说明
- ✅ 添加通配符使用说明
- ✅ 更新使用示例
- ✅ 添加新脚本文档

#### `scripts/USAGE.md` (新增)
- ✅ 完整的脚本使用指南
- ✅ 常见场景示例
- ✅ 工作流说明

### 🎯 优势

1. **版本无关**：使用通配符，更新版本号无需修改脚本
2. **路径灵活**：可从任意位置运行脚本
3. **错误处理**：更好的错误提示和检查
4. **易于使用**：一键完成所有操作

### 🔧 兼容性

- ✅ macOS (主要测试平台)
- ✅ Linux (应该兼容)
- ⚠️ Windows (需要 Git Bash 或 WSL)

### 📋 使用方法

**最推荐的开发流程：**

```bash
# 修改代码后
./scripts/install/build-and-install.sh

# 查看日志
./scripts/debug/view-logs.sh
```

### 🔗 相关文档

- [构建指南](../docs/developer/BUILD_GUIDE.md)
- [使用指南](USAGE.md)
- [脚本说明](README.md)


