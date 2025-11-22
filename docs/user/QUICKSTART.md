# 快速开始指南

## 安装扩展

### 方法 1: 从 .vsix 文件安装（本地测试）

1. 打开 VSCode 或 Cursor
2. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS) 打开命令面板
3. 输入 "Install from VSIX"
4. 选择 `gitdiff-bc-0.1.0.vsix` 文件
5. 重启编辑器

### 方法 2: 从源代码调试

```bash
# 1. 进入项目目录
cd "/Volumes/Lzf-MoveDisk/workspace/github/diff bc"

# 2. 安装依赖（如果还没安装）
npm install

# 3. 编译代码
npm run compile

# 4. 在 VSCode/Cursor 中按 F5 启动调试
# 这会打开一个新的扩展开发窗口
```

## 使用扩展

### 1. 确保前置条件

- ✅ 已安装 Beyond Compare (v3 或 v4)
- ✅ 已安装 Git
- ✅ 在 Git 仓库中工作

### 2. 比较文件

1. 在资源管理器中找到要比较的文件
2. 右键点击文件
3. 选择 **"Compare File with Git HEAD"**
4. Beyond Compare 会自动启动并显示差异

### 3. 比较文件夹

1. 在资源管理器中右键点击文件夹
2. 选择 **"Compare Folder with Git HEAD"**
3. Beyond Compare 会打开文件夹比较视图

### 4. 配置（可选）

如果自动检测失败，可以手动配置：

1. 打开设置 (Ctrl+,)
2. 搜索 "Beyond Compare"
3. 设置 `beyondCompare.executablePath`:
   - Windows: `C:\\Program Files\\Beyond Compare 4\\BCompare.exe`
   - macOS: `/Applications/Beyond Compare.app/Contents/MacOS/bcomp`
   - Linux: `/usr/bin/bcompare`

## 查看日志

如果遇到问题，查看日志可以帮助排查：

1. 打开输出面板: `Ctrl+Shift+U` (Windows/Linux) 或 `Cmd+Shift+U` (macOS)
2. 从下拉菜单选择 **"Beyond Compare Git"**
3. 查看详细的操作日志

## 常见问题

### ❓ 提示"未找到 Beyond Compare"

**解决**: 在设置中配置 `beyondCompare.executablePath`

### ❓ 提示"文件不在 Git 版本控制中"

**解决**: 先提交文件到 Git:
```bash
git add <文件>
git commit -m "提交消息"
```

### ❓ 提示"当前目录不是 Git 仓库"

**解决**: 初始化 Git 仓库:
```bash
git init
```

## 开发和调试

### 项目结构

```
src/
├── extension.ts          # 扩展入口点
├── commands/             # 命令实现
│   ├── compareFile.ts
│   └── compareFolder.ts
├── utils/                # 工具函数
│   ├── bcPath.ts         # Beyond Compare 路径检测
│   ├── gitOps.ts         # Git 操作
│   ├── logger.ts         # 日志记录
│   └── tempFile.ts       # 临时文件管理
└── types/                # TypeScript 类型定义
    └── config.ts
```

### 可用命令

```bash
npm run compile          # 编译 TypeScript
npm run watch           # 监视模式编译
npm run lint            # 运行 ESLint
npm test                # 运行测试
vsce package            # 打包为 .vsix
```

## 发布到 Marketplace

```bash
# 1. 创建发布者账号
# 访问: https://marketplace.visualstudio.com/manage

# 2. 获取 Personal Access Token
# 在 Azure DevOps 中创建 PAT

# 3. 登录 vsce
vsce login <发布者名称>

# 4. 发布
vsce publish
```

## 支持

- 📖 完整文档: [README.md](README.md)
- 📝 更新日志: [CHANGELOG.md](CHANGELOG.md)
- 📄 许可证: MIT License

---

**享受更高效的代码比较！** 🚀

