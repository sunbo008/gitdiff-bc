# dist 目录

此目录用于存放构建产物，主要是 VSIX 打包文件。

## 📦 内容

- `*.vsix` - VS Code 扩展打包文件，可用于发布和分发

## 🚀 生成 VSIX

```bash
npm run package
```

该命令会自动将生成的 VSIX 文件输出到此目录。

## 📝 说明

- 编译后的 JavaScript 文件在 `out/` 目录
- VSIX 打包文件在 `dist/` 目录
- 此目录应添加到 `.gitignore`（VSIX 文件除外，如需版本控制）


