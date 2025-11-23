## 1. 创建 GitHub Actions 工作流

- [x] 1.1 创建 `.github/workflows/` 目录
- [x] 1.2 编写 `release.yml` 工作流文件
  - ✅ 配置触发条件：推送 `v*` 格式的 tag
  - ✅ 添加 checkout、setup-node 步骤
  - ✅ 添加依赖安装和编译步骤
  - ✅ 添加 VSIX 打包步骤（`vsce package`）
- [x] 1.3 配置从 CHANGELOG.md 提取 Release notes 的逻辑
  - ✅ 使用 awk 提取对应版本的内容
  - ✅ 设置提取失败时的默认说明
- [x] 1.4 配置创建 GitHub Release 和上传 VSIX 的步骤
  - ✅ 使用 `softprops/action-gh-release@v2`
  - ✅ 设置 Release 标题、tag、Release notes
  - ✅ 上传 VSIX 文件作为 Release asset

## 2. 测试 GitHub Actions 工作流

- [ ] 2.1 推送测试 tag（例如 `v0.1.5-test`）验证工作流
- [ ] 2.2 检查 GitHub Actions 运行日志
- [ ] 2.3 验证 GitHub Release 创建成功
- [ ] 2.4 验证 VSIX 文件上传成功且可下载
- [ ] 2.5 验证 Release notes 内容正确
- [ ] 2.6 删除测试 Release 和 tag

## 3. 更新文档

- [x] 3.1 在 `README.md` 中添加"安装"和"离线安装"章节
  - ✅ 在顶部添加 GitHub Release 版本徽章
  - ✅ 添加从 Marketplace 安装的说明
  - ✅ 说明如何访问 GitHub Releases 页面下载 VSIX
  - ✅ 说明 VSIX 文件安装方法（UI 和命令行）
  - ✅ 列举离线安装的适用场景（企业内网、离线环境、特定版本、批量部署）
- [x] 3.2 更新 `docs/PUBLISH.md` 发布流程文档
  - ✅ 添加双轨发布流程说明（GitHub Releases + Marketplace）
  - ✅ 添加 GitHub Releases 自动发布的详细步骤
  - ✅ 说明 Git tag 触发机制和工作流程
  - ✅ 添加完整的故障排查指南
  - ✅ 提供手动备用发布方案
- [x] 3.3 更新 `CHANGELOG.md` 记录本次功能新增
  - ✅ 在 `[未发布]` 章节添加 GitHub Releases 自动发布功能
  - ✅ 添加离线安装文档说明
  - ✅ 添加发布流程文档更新说明

## 4. 正式发布验证

- [ ] 4.1 更新版本号（例如从 0.1.4 升级到 0.1.5）
- [ ] 4.2 更新 CHANGELOG.md 为新版本创建正式条目
- [ ] 4.3 提交所有更改
- [ ] 4.4 创建并推送正式 tag（例如 `git tag v0.1.5 && git push origin v0.1.5`）
- [ ] 4.5 验证 GitHub Actions 自动触发并成功完成
- [ ] 4.6 访问 GitHub Releases 页面检查 Release 和 VSIX 文件
- [ ] 4.7 下载 VSIX 文件并在本地测试安装
- [ ] 4.8 （可选）手动发布到 VSCode Marketplace（`npm run publish:patch`）


