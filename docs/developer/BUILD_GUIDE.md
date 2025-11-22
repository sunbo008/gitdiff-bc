# 构建说明

## 📁 目录结构

```
gitdiff-bc/
├── src/           # TypeScript 源代码
├── out/           # 编译输出（JS 文件）
└── dist/          # 打包产物（VSIX 文件）
```

## 🔧 构建命令

### 编译

将 TypeScript 源代码编译为 JavaScript：

```bash
npm run compile
```

编译产物输出到 `out/` 目录。

### 监视模式

自动监视文件变化并重新编译：

```bash
npm run watch
```

### 打包

编译并打包为 VSIX 文件：

```bash
npm run package
```

VSIX 文件会输出到 `dist/` 目录，例如：`dist/gitdiff-bc-0.1.0.vsix`

## 🚀 完整开发流程

```bash
# 1. 安装依赖
npm install

# 2. 编译
npm run compile

# 3. 开发调试（使用 F5 或命令面板）
# VS Code 会自动从 out/ 目录加载编译后的代码

# 4. 打包发布
npm run package
```

## 📝 注意事项

- `out/` 目录已加入 `.gitignore`，不会提交到版本控制
- `dist/` 目录用于存放 VSIX 文件，可根据需要提交
- 打包前确保代码已通过测试：`npm test`


