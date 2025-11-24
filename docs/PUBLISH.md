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

## 双轨发布流程（GitHub Releases + Marketplace）

本项目采用**双轨发布**策略：
1. **GitHub Releases** - 自动发布 VSIX 文件（用于离线安装）
2. **VSCode Marketplace** - 手动或自动发布（用于在线安装）

### GitHub Releases 自动发布

#### 触发条件
推送 `v*` 格式的 Git tag（例如 `v0.1.5`）会自动触发 GitHub Actions 工作流。

#### 自动化流程

```bash
# 1. 更新 CHANGELOG.md
# 在 CHANGELOG.md 中为新版本添加更新说明

# 2. 提交所有更改
git add .
git commit -m "发布: 准备 v0.1.5 版本"

# 3. 创建并推送 tag
git tag v0.1.5
git push origin v0.1.5

# 4. GitHub Actions 自动执行：
#    - 编译 TypeScript
#    - 打包 VSIX
#    - 从 CHANGELOG.md 提取 Release notes
#    - 创建 GitHub Release
#    - 上传 VSIX 文件
```

#### 工作流文件位置
`.github/workflows/release.yml`

#### VSIX 命名规范
`gitdiff-bc-<版本号>.vsix`（例如：`gitdiff-bc-0.1.5.vsix`）

#### Release Notes 来源
自动从 `CHANGELOG.md` 中提取对应版本的内容：
- 格式：`## [版本号]` 到下一个 `## [版本号]` 之间的内容
- 如果提取失败，使用默认说明："Release version X.Y.Z"

### VSCode Marketplace 发布

在 GitHub Release 创建成功后，可以选择手动发布到 Marketplace：

```bash
# 方法 1: 使用 npm scripts（推荐）
npm run publish:patch   # 已自动更新版本号

# 方法 2: 直接使用 vsce
vsce publish
```

**注意**：确保 `package.json` 中的版本号与 Git tag 一致。

## 完整发布工作流

### 推荐流程（双轨发布）

1. **开发** → 本地测试（F5 调试）
2. **测试** → 打包测试（`vsce package`）
3. **更新文档** → 更新 `CHANGELOG.md` 记录本次更新
4. **提交代码** → `git add . && git commit -m "发布: 准备 vX.Y.Z"`
5. **推送 tag** → `git tag vX.Y.Z && git push origin vX.Y.Z`
6. **等待 GitHub Actions** → 验证 GitHub Release 创建成功
7. **验证 VSIX** → 从 GitHub Releases 下载并测试 VSIX 安装
8. **发布到 Marketplace** → 运行 `npm run publish:patch`（可选，手动触发）
9. **验证 Marketplace** → 在 Marketplace 查看扩展页面
10. **最终测试** → 从 Marketplace 安装并测试

### 仅发布到 Marketplace（传统流程）

如果只需要发布到 Marketplace，不需要 GitHub Release：

1. **开发** → 本地测试（F5 调试）
2. **测试** → 打包测试（`vsce package`）
3. **更新** → 更新 CHANGELOG 和版本号
4. **发布** → 运行 `npm run publish:patch`（或 minor/major）
5. **验证** → 在 Marketplace 查看扩展页面
6. **安装** → 从 Marketplace 安装并测试

## 故障排查

### GitHub Actions 发布失败

#### 查看日志
1. 访问 GitHub 仓库的 **Actions** 标签页
2. 找到失败的工作流运行记录
3. 点击查看详细日志

#### 常见问题

**问题 1: CHANGELOG 格式错误导致 Release notes 为空**
- **原因**: CHANGELOG.md 格式不符合 [Keep a Changelog](https://keepachangelog.com/) 规范
- **解决**: 确保使用 `## [版本号]` 格式标记版本
- **后果**: Release 仍会创建，但 notes 为默认说明

**问题 2: VSIX 打包失败**
- **原因**: 编译错误或依赖问题
- **解决**: 本地运行 `npm run compile` 和 `vsce package` 验证
- **检查**: 确保 `.vscodeignore` 配置正确

**问题 3: 权限错误**
- **原因**: GITHUB_TOKEN 权限不足
- **解决**: 工作流已配置 `permissions: contents: write`，无需额外设置

#### 重新触发发布

**方法 1: 重新运行工作流**
1. 访问 GitHub Actions 页面
2. 找到失败的工作流
3. 点击 **Re-run all jobs**

**方法 2: 删除 Release 和 tag 后重新推送**
```bash
# 删除本地 tag
git tag -d v0.1.5

# 删除远程 tag
git push origin :refs/tags/v0.1.5

# 在 GitHub 上手动删除 Release

# 重新推送 tag
git tag v0.1.5
git push origin v0.1.5
```

### 手动上传 VSIX（备用方案）

如果 GitHub Actions 完全失败，可以手动创建 Release：

```bash
# 1. 本地打包
vsce package --out dist/

# 2. 访问 GitHub Releases 页面
# https://github.com/sunbo008/gitdiff-bc/releases/new

# 3. 手动填写信息：
#    - Tag: v0.1.5
#    - Title: v0.1.5
#    - Description: 从 CHANGELOG.md 复制对应内容
#    - 上传 dist/gitdiff-bc-0.1.5.vsix

# 4. 点击 "Publish release"
```

## 参考链接

- [VSCode 扩展发布文档](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce 命令行工具](https://github.com/microsoft/vscode-vsce)
- [Marketplace 管理页面](https://marketplace.visualstudio.com/manage)

