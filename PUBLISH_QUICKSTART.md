# 🚀 快速发布指南

## 一次性设置（首次发布前）

### 1. 创建 Publisher（如果还没有）
访问 https://marketplace.visualstudio.com/manage
- 使用 `sunbo008@gmail.com` 登录
- 创建 Publisher，ID 设为 `sunbo008`

### 2. 获取 Personal Access Token
1. 访问 https://dev.azure.com/
2. 点击右上角头像 → Personal Access Tokens
3. 点击 "New Token"
4. 配置：
   - Name: `VSCode Extension Publishing`
   - Organization: `All accessible organizations`
   - Expiration: 自定义（建议 1 年）
   - Scopes: `Marketplace` → **Manage** ✓
5. 点击 Create 并**立即复制 Token**（只显示一次！）

### 3. 登录 vsce
```bash
vsce login sunbo008
```
输入刚才复制的 Token

## 日常发布流程

### 方式一：自动发布（推荐）✨

```bash
# 1. 发布前检查
npm run check

# 2. 选择版本类型并发布
npm run publish:patch   # 修复 bug: 0.1.0 → 0.1.1
npm run publish:minor   # 新功能: 0.1.0 → 0.2.0
npm run publish:major   # 破坏性更改: 0.1.0 → 1.0.0

# 这将自动完成：
# ✅ 运行发布前检查
# ✅ 更新版本号并创建 Git tag
# ✅ 发布到 VSCode Marketplace
# ✅ 推送代码和 tag 到 GitHub
# ✅ 触发 GitHub Actions 创建 Release 并上传 VSIX
```

就这么简单！✅

### 方式二：手动控制

```bash
# 1. 更新 CHANGELOG.md
# 2. 更新版本号
npm version patch  # 或 minor / major

# 3. 发布前检查
npm run check

# 4. 发布
vsce publish
```

## 发布后验证

1. 访问 https://marketplace.visualstudio.com/items?itemName=sunbo008.gitdiff-bc
2. 检查扩展信息是否正确
3. 点击 Install 测试安装

## 常见问题速查

### 登录失败？
```bash
# 重新登录
vsce login sunbo008
```

### 想先打包测试？
```bash
# 打包但不发布
npm run package

# 安装 .vsix 文件测试
code --install-extension dist/gitdiff-bc-0.1.0.vsix
```

### 发布错了怎么办？
访问 https://marketplace.visualstudio.com/manage/publishers/sunbo008
找到扩展 → Unpublish（慎用！）

## 详细文档

查看 `docs/PUBLISH.md` 获取完整文档和 CI/CD 配置。

