# VSCode Marketplace 发布指南

## 前提条件

### 1. 创建 Publisher
访问 [VSCode Marketplace Management](https://marketplace.visualstudio.com/manage) 并使用 `sunbo008@gmail.com` 登录。

- 如果还没有 Publisher，创建一个名为 `sunbo008` 的 Publisher
- Publisher ID 必须与 `package.json` 中的 `publisher` 字段匹配

### 2. 创建 Personal Access Token (PAT)

1. 访问 [Azure DevOps](https://dev.azure.com/)
2. 点击右上角的用户设置 → Personal Access Tokens
3. 创建新的 Token：
   - **Name**: VSCode Extension Publishing
   - **Organization**: All accessible organizations
   - **Expiration**: 自定义（建议 1 年）
   - **Scopes**: 选择 `Marketplace` → **Manage**（完全访问权限）
4. 复制生成的 Token（只显示一次！）

### 3. 配置 Token

```bash
# 登录（会提示输入 PAT）
vsce login sunbo008

# 或者直接使用 Token
vsce publish -p <YOUR_PAT>
```

## 手动发布

### 第一次发布

```bash
# 1. 确保版本号正确（package.json）
npm version patch  # 或 minor / major

# 2. 打包并发布
vsce publish
```

### 后续版本发布

```bash
# 自动增加版本号并发布
vsce publish patch   # 0.1.0 → 0.1.1
vsce publish minor   # 0.1.0 → 0.2.0
vsce publish major   # 0.1.0 → 1.0.0
```

## 自动发布（推荐）

### 使用 NPM Scripts

已在 `package.json` 中配置了快捷命令：

```bash
# 发布补丁版本（bug 修复）
npm run publish:patch

# 发布次版本（新功能）
npm run publish:minor

# 发布主版本（破坏性更改）
npm run publish:major
```

### 使用 GitHub Actions（可选）

创建 `.github/workflows/publish.yml` 可以实现推送 tag 自动发布：

```yaml
name: Publish Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run compile
      - name: Publish to VSCode Marketplace
        run: vsce publish -p ${{ secrets.VSCE_PAT }}
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
```

需要在 GitHub 仓库设置中添加 Secret：`VSCE_PAT`

## 发布前检查清单

- [ ] 所有测试通过
- [ ] 更新 `CHANGELOG.md`
- [ ] 更新版本号
- [ ] 检查 README.md 内容完整
- [ ] 确认 icon.png 存在
- [ ] 运行 `vsce package` 预览打包内容
- [ ] 测试打包的 .vsix 文件

## 常见问题

### Q: 发布失败 "Error: Missing publisher name"
A: 确保 `package.json` 中有 `"publisher": "sunbo008"`

### Q: 发布失败 "Error: Authentication failed"
A: 重新运行 `vsce login sunbo008` 或检查 PAT 是否过期

### Q: 如何撤回已发布的版本？
A: 访问 [Marketplace Management](https://marketplace.visualstudio.com/manage/publishers/sunbo008)，找到扩展点击 "Unpublish"

### Q: 如何更新已发布的扩展信息？
A: 修改 `package.json` 和 `README.md`，然后发布新版本

## 有用的命令

```bash
# 查看当前登录状态
vsce ls-publishers

# 打包但不发布（用于测试）
vsce package

# 查看将要打包的文件
vsce ls

# 显示文件树
vsce ls --tree

# 发布预发布版本
vsce publish --pre-release
```

## 发布工作流建议

1. **开发** → 本地测试（F5 调试）
2. **测试** → 打包测试（`vsce package`）
3. **更新** → 更新 CHANGELOG 和版本号
4. **发布** → 运行 `npm run publish:patch`（或 minor/major）
5. **验证** → 在 Marketplace 查看扩展页面
6. **安装** → 从 Marketplace 安装并测试

## 参考链接

- [VSCode 扩展发布文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce 命令行工具](https://github.com/microsoft/vscode-vsce)
- [Marketplace 管理页面](https://marketplace.visualstudio.com/manage)

