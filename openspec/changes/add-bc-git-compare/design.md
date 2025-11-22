# 技术设计文档

## Context

这是一个 VSCode 扩展项目,旨在提供通过右键菜单快速调用 Beyond Compare 比较文件/文件夹与 Git HEAD 版本的功能。Beyond Compare 是一个跨平台的专业文件比较工具,广泛用于代码审查和文件同步场景。

**兼容性说明:**
- 完全兼容 VSCode 1.60.0+
- 完全兼容 Cursor（基于 VSCode 构建,使用相同的扩展 API）
- 所有功能在 VSCode 和 Cursor 中行为一致

**约束条件:**
- 必须兼容 Windows、macOS、Linux 三大平台
- 依赖外部工具 Beyond Compare 和 Git
- 需要访问文件系统和执行外部进程
- 遵循 VSCode 扩展 API 规范

**相关方:**
- 开发者用户 (需要高效的代码比较工具)
- VSCode Marketplace (扩展发布平台)

## Goals / Non-Goals

**Goals:**
- 提供简洁易用的右键菜单集成
- 自动检测 Beyond Compare 安装路径
- 支持文件和文件夹的 Git HEAD 比较
- 跨平台兼容性 (Windows/macOS/Linux)
- 跨编辑器兼容性 (VSCode/Cursor)
- 提供友好的错误提示和配置选项

**Non-Goals:**
- 不实现自己的 diff 算法或可视化界面
- 不支持除 Beyond Compare 外的其他比较工具 (可后期扩展)
- 不支持比较任意 Git 版本 (仅限 HEAD),避免功能过载
- 不提供 Git 操作功能 (提交、推送等)

## Decisions

### 决策 1: 使用 simple-git 库进行 Git 操作

**理由:**
- simple-git 是成熟的 Node.js Git 库,API 简洁
- 避免手动解析 git 命令输出
- 提供 Promise/async 支持,便于错误处理

**备选方案:**
- 直接使用 child_process 调用 git 命令 - 需要手动解析输出,容易出错
- 使用 VSCode 内置 Git API - 功能有限,不足以满足需求

### 决策 2: Beyond Compare 路径检测策略

**跨平台默认路径:**
- Windows: `C:\Program Files\Beyond Compare 4\BCompare.exe`
- macOS: `/Applications/Beyond Compare.app/Contents/MacOS/bcomp`
- Linux: `/usr/bin/bcompare` 或 `/usr/local/bin/bcompare`

**检测流程:**
1. 优先使用用户配置的自定义路径
2. 检测常见安装路径
3. 尝试从 PATH 环境变量中查找
4. 如果都找不到,提示用户配置路径

**理由:**
- 覆盖大多数用户的默认安装场景
- 提供灵活的配置选项
- 避免硬编码单一路径

### 决策 3: 临时文件管理

为了比较 Git HEAD 版本,需要将历史版本的文件内容写入临时文件。

**策略:**
- 使用 `os.tmpdir()` 获取系统临时目录
- 为每次比较创建唯一的临时文件 (使用 UUID 或时间戳)
- 比较完成后立即清理临时文件
- 使用 try-finally 确保即使出错也能清理

**理由:**
- Beyond Compare 需要物理文件路径作为输入
- 临时文件避免污染工作目录
- 自动清理防止磁盘占用

### 决策 4: 命令注册和上下文菜单

**命令定义:**
- `extension.compareFileWithHead` - 比较文件
- `extension.compareFolderWithHead` - 比较文件夹

**菜单显示条件:**
- 文件命令: 仅在资源管理器中选中文件时显示
- 文件夹命令: 仅在资源管理器中选中文件夹时显示

**理由:**
- 清晰的命令命名规范
- 上下文相关的菜单项,避免混乱
- 符合 VSCode UX 最佳实践

## Risks / Trade-offs

### 风险 1: Beyond Compare 版本兼容性

不同版本的 Beyond Compare 命令行参数可能有差异。

**缓解措施:**
- 使用最通用的命令行参数 (v3/v4 兼容)
- 在文档中说明支持的版本范围
- 提供配置项允许用户自定义参数

### 风险 2: 跨平台路径差异

Windows/macOS/Linux 的文件路径格式和权限模型不同。

**缓解措施:**
- 使用 Node.js path 模块处理路径
- 在不同平台上进行充分测试
- 添加详细的日志记录,便于定位问题

### 风险 3: Git 仓库状态不确定

用户可能在非 Git 仓库、detached HEAD 状态等特殊场景下使用。

**缓解措施:**
- 在执行前检测 Git 仓库状态
- 对无效状态提供明确的错误提示
- 禁用或隐藏不可用的命令

### Trade-off: 功能简洁 vs 扩展性

当前设计仅支持 Beyond Compare 和 Git HEAD 比较,未来可能需要支持更多工具或 Git 引用。

**权衡:**
- 优先实现核心用例 (80% 用户需求)
- 保持代码结构的可扩展性
- 后期根据用户反馈逐步增强

## Migration Plan

这是一个全新的扩展,无需迁移计划。

**首次发布流程:**
1. 在 VSCode Marketplace 创建发布者账号
2. 生成并测试 .vsix 包
3. 使用 vsce 工具发布初始版本 (v0.1.0)
4. 收集用户反馈,迭代改进

**回滚策略:**
- 用户可以卸载扩展恢复到无扩展状态
- 如果发现严重 bug,从 Marketplace 撤回版本

## Open Questions

1. **是否需要支持比较多个文件?**
   - 当前设计仅支持单个文件/文件夹
   - 多选场景需要考虑 UI 交互和 BC 能力
   答：仅支持单个文件/文件夹

2. **是否需要支持其他 Git 引用 (如 branch、tag、commit SHA)?**
   - 可通过命令面板输入,但增加复杂度
   - 可作为 v2 功能
   答：以后再说
3. **是否需要支持其他比较工具 (如 WinMerge、Meld)?**
   - 当前专注于 Beyond Compare
   - 可设计插件化架构支持多工具
   答：只专注于 Beyond Compare
4. **LICENSE 选择?**
   - 建议使用 MIT License
   - 需要确认是否有企业使用场景的限制
   答：使用 MIT License

5. **是否支持 Cursor 编辑器?**
   - Cursor 基于 VSCode 构建,使用相同的扩展 API
   - 无需额外开发,天然兼容
   答：完全支持,与 VSCode 行为一致
