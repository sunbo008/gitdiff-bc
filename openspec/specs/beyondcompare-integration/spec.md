# beyondcompare-integration Specification

## Purpose
TBD - created by archiving change add-workspace-root-compare. Update Purpose after archive.
## Requirements
### Requirement: 工作区根目录比较
扩展 SHALL 支持在资源管理器空白区域右键比较工作区根目录与 Git HEAD。

#### Scenario: 在空白区域触发根目录比较
- **WHEN** 用户在资源管理器空白区域右键
- **AND** 选择"与 Git HEAD 比较文件夹"命令
- **THEN** 扩展应比较当前工作区根目录与 Git HEAD
- **AND** 使用 Beyond Compare 显示差异

#### Scenario: 多工作区环境处理
- **WHEN** 用户在多工作区环境中在空白区域右键
- **THEN** 扩展应使用第一个工作区根目录作为比较目标
- **AND** 如果没有工作区，应显示友好的错误提示

### Requirement: 文件夹比较命令
扩展的文件夹比较命令 SHALL 支持两种调用方式：带 uri 参数（比较指定文件夹）和不带 uri 参数（比较工作区根目录）。

#### Scenario: 带 uri 参数调用
- **WHEN** 用户右键点击特定文件夹并选择比较命令
- **THEN** 扩展应比较该文件夹与 Git HEAD
- **AND** 正常执行文件夹比较流程

#### Scenario: 不带 uri 参数调用
- **WHEN** 命令被调用但未提供 uri 参数
- **THEN** 扩展应获取当前工作区根目录
- **AND** 使用该根目录作为比较目标
- **AND** 如果无法确定工作区根目录，应显示错误提示

### Requirement: 文件夹比较错误处理
扩展的文件夹比较功能 SHALL 在文件夹未入库时显示友好的错误信息。

#### Scenario: 检测未入库的文件夹
- **WHEN** 用户尝试比较一个未纳入 Git 版本控制的文件夹
- **THEN** 扩展应在执行 git archive 之前检查文件夹是否存在于 Git HEAD 中
- **AND** 使用 `git ls-tree -d HEAD` 命令进行检查

#### Scenario: 显示友好的错误信息
- **WHEN** 检测到文件夹未入库
- **THEN** 扩展应显示简洁明确的错误信息："文件夹未纳入 Git 版本控制，无法比较。请先提交该文件夹。"
- **AND** 不应显示包含 git archive、tar 等技术细节的原始错误

#### Scenario: 根目录比较不受影响
- **WHEN** 用户比较工作区根目录
- **THEN** 扩展应跳过文件夹存在性检查（根目录总是存在）
- **AND** 直接执行正常的比较流程

#### Scenario: 已入库文件夹正常比较
- **WHEN** 文件夹已纳入 Git 版本控制
- **THEN** 扩展应继续执行正常的比较流程
- **AND** 不影响现有功能

### Requirement: Beyond Compare 路径检测

扩展 MUST 能够在不同操作系统上自动检测 Beyond Compare 的安装路径。

#### Scenario: Windows 系统检测默认安装路径

- **WHEN** 扩展在 Windows 系统上激活
- **AND** Beyond Compare 4 安装在默认路径 `C:\Program Files\Beyond Compare 4\BCompare.exe`
- **THEN** 扩展应自动检测到该路径

#### Scenario: macOS 系统检测默认安装路径

- **WHEN** 扩展在 macOS 系统上激活
- **AND** Beyond Compare 安装在 `/Applications/Beyond Compare.app/`
- **THEN** 扩展应检测到 `bcomp` 命令行工具路径

#### Scenario: Linux 系统从 PATH 查找

- **WHEN** 扩展在 Linux 系统上激活
- **AND** `bcompare` 命令在系统 PATH 中
- **THEN** 扩展应能够找到该命令

#### Scenario: 用户自定义路径配置

- **WHEN** 用户在设置中配置了自定义 Beyond Compare 路径
- **THEN** 扩展应优先使用用户配置的路径
- **AND** 忽略自动检测逻辑

#### Scenario: Beyond Compare 未安装

- **WHEN** 系统上未安装 Beyond Compare
- **AND** 用户尝试执行比较命令
- **THEN** 扩展应显示友好的错误提示
- **AND** 提示用户安装 Beyond Compare 或配置路径

### Requirement: 文件与 Git HEAD 比较

扩展 MUST 支持通过右键菜单比较单个文件与 Git HEAD 版本。

#### Scenario: 已修改文件的比较

- **WHEN** 用户在资源管理器中右键点击已修改的文件
- **AND** 选择 "Compare File with Git HEAD" 命令
- **THEN** 扩展应从 Git HEAD 获取该文件的历史版本
- **AND** 创建临时文件保存历史版本内容
- **AND** 启动 Beyond Compare 比较当前文件与历史版本
- **AND** 在比较完成后清理临时文件

#### Scenario: 新增文件无法比较

- **WHEN** 用户尝试比较一个 Git 未跟踪的新文件
- **THEN** 扩展应显示错误提示 "文件不在 Git 版本控制中"
- **AND** 不启动 Beyond Compare

#### Scenario: 未修改文件的比较

- **WHEN** 用户比较一个未修改的文件 (与 HEAD 相同)
- **THEN** 扩展应正常启动 Beyond Compare
- **AND** Beyond Compare 显示两个文件内容相同

#### Scenario: 非 Git 仓库文件

- **WHEN** 用户尝试比较不在 Git 仓库中的文件
- **THEN** 扩展应显示错误提示 "当前目录不是 Git 仓库"
- **AND** 不执行比较操作

### Requirement: 文件夹与 Git HEAD 比较

扩展 MUST 支持通过右键菜单比较文件夹与 Git HEAD 版本。

#### Scenario: 文件夹差异比较

- **WHEN** 用户在资源管理器中右键点击文件夹
- **AND** 选择 "Compare Folder with Git HEAD" 命令
- **THEN** 扩展应获取该文件夹在 Git HEAD 的快照
- **AND** 启动 Beyond Compare 进行文件夹比较
- **AND** 显示文件夹中新增、修改、删除的文件

#### Scenario: 根目录比较

- **WHEN** 用户在 Git 仓库根目录执行文件夹比较
- **THEN** 扩展应比较整个工作区与 Git HEAD
- **AND** Beyond Compare 显示所有差异

#### Scenario: 子文件夹比较

- **WHEN** 用户选择仓库中的子文件夹进行比较
- **THEN** 扩展应仅比较该子文件夹及其内容
- **AND** 不包括父级或兄弟文件夹

### Requirement: 右键菜单集成

扩展 MUST 在 VSCode 资源管理器的右键菜单中注册比较命令。

#### Scenario: 文件右键菜单显示

- **WHEN** 用户在资源管理器中右键点击文件
- **THEN** 上下文菜单应包含 "Compare File with Git HEAD" 选项
- **AND** 该选项应位于合理的菜单位置 (靠近其他 Git 相关操作)

#### Scenario: 文件夹右键菜单显示

- **WHEN** 用户在资源管理器中右键点击文件夹
- **THEN** 上下文菜单应包含 "Compare Folder with Git HEAD" 选项

#### Scenario: 多选时菜单行为

- **WHEN** 用户同时选中多个文件或文件夹
- **THEN** 比较命令应禁用或隐藏
- **OR** 仅对第一个选中项执行比较 (可选实现)

### Requirement: 扩展配置

扩展 MUST 提供配置项允许用户自定义行为。

#### Scenario: Beyond Compare 路径配置

- **WHEN** 用户打开 VSCode 设置
- **THEN** 应有配置项 `beyondCompare.executablePath`
- **AND** 配置项应支持输入自定义的可执行文件完整路径
- **AND** 配置项应有描述说明其用途

#### Scenario: 配置项即时生效

- **WHEN** 用户修改配置项并保存
- **THEN** 扩展应立即应用新配置
- **AND** 无需重启 VSCode

#### Scenario: 日志级别配置

- **WHEN** 用户需要调试问题
- **THEN** 应有配置项 `beyondCompare.logLevel` 控制日志详细程度
- **AND** 支持 "error", "warn", "info", "debug" 级别

### Requirement: 错误处理和用户反馈

扩展 MUST 提供清晰的错误提示和操作反馈。

#### Scenario: 操作进度提示

- **WHEN** 用户执行比较命令
- **THEN** 扩展应显示进度提示 (如 "正在准备比较...")
- **AND** 操作完成或失败后提示应自动消失

#### Scenario: Beyond Compare 启动失败

- **WHEN** Beyond Compare 可执行文件无法执行 (如权限问题)
- **THEN** 扩展应显示错误通知
- **AND** 错误消息应包含具体的失败原因
- **AND** 提供解决建议 (如检查文件权限)

#### Scenario: Git 命令失败

- **WHEN** Git 操作失败 (如仓库损坏)
- **THEN** 扩展应捕获 Git 错误
- **AND** 显示用户友好的错误消息
- **AND** 在 Output Channel 记录详细的错误堆栈

#### Scenario: 临时文件清理失败

- **WHEN** 临时文件创建成功但清理失败
- **THEN** 扩展应记录警告日志
- **AND** 不阻塞用户操作
- **AND** 依赖系统定期清理临时目录

### Requirement: 日志记录

扩展 MUST 提供详细的日志输出用于问题排查。

#### Scenario: Output Channel 创建

- **WHEN** 扩展激活
- **THEN** 应创建名为 "Beyond Compare Git" 的 Output Channel
- **AND** 用户可以在输出面板中查看日志

#### Scenario: 关键操作日志

- **WHEN** 扩展执行关键操作 (如检测路径、调用 Git、启动 BC)
- **THEN** 应记录操作开始和结果
- **AND** 包含时间戳和操作参数
- **AND** 区分不同日志级别 (info/warn/error)

#### Scenario: 敏感信息过滤

- **WHEN** 记录日志
- **THEN** 扩展应避免记录敏感信息 (如完整文件内容)
- **AND** 仅记录文件路径、命令参数等元数据

### Requirement: 跨平台兼容性

扩展 MUST 在 Windows、macOS、Linux 上均能正常工作。

#### Scenario: Windows 路径处理

- **WHEN** 在 Windows 系统上运行
- **THEN** 扩展应正确处理反斜杠路径分隔符
- **AND** 支持包含空格的路径 (如 "Program Files")
- **AND** 正确处理盘符 (如 "C:\")

#### Scenario: macOS 应用程序包

- **WHEN** 在 macOS 上调用 Beyond Compare
- **THEN** 扩展应使用 `.app` 包内的 `bcomp` 命令行工具
- **AND** 不尝试直接执行 `.app` 作为可执行文件

#### Scenario: Linux 权限处理

- **WHEN** 在 Linux 上运行
- **THEN** 扩展应检查 `bcompare` 文件的可执行权限
- **AND** 如果无权限则提示用户

### Requirement: 扩展市场元数据优化

扩展的 `package.json` 配置 SHALL 包含精确的分类和全面的关键词列表，以确保在 VSCode 和 Cursor 扩展商店中的可发现性。

#### Scenario: 用户在 Cursor 中搜索 "gitdiff"

- **WHEN** 用户在 Cursor 扩展商店搜索框输入 "gitdiff"
- **THEN** 扩展应出现在搜索结果中
- **AND** 扩展名称、描述和关键词应匹配搜索词

#### Scenario: 用户在 VSCode 中按分类浏览

- **WHEN** 用户在 VSCode 扩展商店选择 "SCM Providers" 分类
- **THEN** 扩展应出现在该分类的扩展列表中

#### Scenario: 用户搜索 "beyond compare git"

- **WHEN** 用户输入组合搜索词 "beyond compare git"
- **THEN** 扩展应出现在搜索结果的前列
- **AND** 关键词匹配度应高于竞争扩展

### Requirement: 扩展关键词覆盖

扩展的关键词列表 SHALL 包含以下类型的搜索词：

1. **核心产品词**: gitdiff, gitdiff-bc, beyond compare, beyond-compare, bc
2. **功能描述词**: git, diff, compare, merge, git diff, file compare, folder compare
3. **使用场景词**: version control, source control, scm

#### Scenario: 关键词包含扩展名称变体

- **WHEN** package.json 定义关键词列表
- **THEN** 列表必须包含 "gitdiff" 和 "gitdiff-bc"
- **AND** 列表必须包含 "beyond compare" 和 "beyond-compare"

#### Scenario: 关键词包含功能描述

- **WHEN** 用户搜索 "git diff" 或 "file compare"
- **THEN** 扩展应通过关键词匹配出现在搜索结果中

### Requirement: GitHub Releases VSIX 文件发布

扩展 SHALL 在每次版本发布时自动将 VSIX 安装包上传到 GitHub Releases，以便用户进行离线安装。

#### Scenario: Git tag 触发自动发布

- **WHEN** 开发者推送 `v*` 格式的 Git tag（例如 `v0.1.5`）
- **THEN** GitHub Actions 工作流应自动触发
- **AND** 自动编译、打包和上传 VSIX 文件到 GitHub Releases

#### Scenario: GitHub Release 包含 VSIX 资产

- **WHEN** GitHub Actions 成功完成发布流程
- **THEN** 对应版本的 GitHub Release 应包含 VSIX 文件
- **AND** VSIX 文件命名格式为 `gitdiff-bc-<version>.vsix`（例如 `gitdiff-bc-0.1.5.vsix`）

#### Scenario: 自动生成 Release Notes

- **WHEN** GitHub Actions 创建 Release
- **THEN** 应从 CHANGELOG.md 中提取对应版本的更新说明
- **AND** 使用提取的内容作为 Release notes
- **AND** 如果提取失败，使用默认简短说明

#### Scenario: 用户从 GitHub 下载 VSIX

- **WHEN** 用户访问 GitHub Releases 页面
- **THEN** 应能看到每个版本的 VSIX 文件下载链接
- **AND** 点击下载后应获得可安装的 .vsix 文件

### Requirement: 离线安装文档

扩展的 README SHALL 包含清晰的离线安装指南，说明如何从 GitHub Releases 下载和安装 VSIX 文件。

#### Scenario: README 包含离线安装章节

- **WHEN** 用户阅读 README.md
- **THEN** 应有"离线安装"或"手动安装"章节
- **AND** 章节应包含 GitHub Releases 页面链接
- **AND** 章节应说明 VSIX 文件的安装步骤

#### Scenario: 安装步骤清晰易懂

- **WHEN** 用户按照文档操作
- **THEN** 文档应包含：
  1. 如何访问 GitHub Releases 页面
  2. 如何选择并下载对应版本的 VSIX 文件
  3. 如何在 VSCode/Cursor 中从 VSIX 安装扩展
- **AND** 步骤应包含必要的截图或命令示例

#### Scenario: 文档说明离线安装的适用场景

- **WHEN** 用户考虑是否使用离线安装
- **THEN** 文档应说明离线安装的适用场景：
  - 企业内网环境
  - 无法访问 Marketplace 的环境
  - 需要安装特定历史版本
  - 需要在多台机器批量安装

### Requirement: GitHub Actions 工作流配置

扩展仓库 SHALL 包含 GitHub Actions 工作流文件，实现 VSIX 文件的自动构建和发布。

#### Scenario: 工作流文件存在且配置正确

- **WHEN** 仓库中存在 `.github/workflows/release.yml` 文件
- **THEN** 文件应配置为监听 `v*` 格式的 tag 推送事件
- **AND** 工作流应包含以下步骤：
  - Checkout 代码
  - 安装 Node.js 和依赖
  - 编译 TypeScript
  - 打包 VSIX
  - 创建 GitHub Release
  - 上传 VSIX 到 Release

#### Scenario: 工作流使用稳定的 Actions

- **WHEN** 定义工作流步骤
- **THEN** 应使用社区认可的稳定 Actions：
  - `actions/checkout` - 代码检出
  - `actions/setup-node` - Node.js 环境
  - `softprops/action-gh-release` 或 `ncipollo/release-action` - 创建 Release
- **AND** Actions 版本应使用具体版本号或主版本号（如 `@v3`）

#### Scenario: 工作流失败通知

- **WHEN** GitHub Actions 工作流执行失败
- **THEN** GitHub 应自动向仓库所有者发送失败通知
- **AND** 工作流日志应包含详细的错误信息便于排查

#### Scenario: 手动重新触发工作流

- **WHEN** GitHub Actions 工作流失败或需要重新发布
- **THEN** 应能够通过 GitHub UI 手动重新触发工作流
- **OR** 可以删除 Release 和 tag 后重新推送 tag

### Requirement: 发布流程文档更新

扩展的发布文档 SHALL 更新为包含 GitHub Releases 自动发布的说明。

#### Scenario: PUBLISH.md 包含 Git tag 发布流程

- **WHEN** 开发者查阅 `docs/PUBLISH.md`
- **THEN** 文档应包含使用 Git tag 触发自动发布的步骤
- **AND** 说明如何创建和推送 tag
- **AND** 说明 tag 命名规范（`v*` 格式）

#### Scenario: 文档说明双轨发布流程

- **WHEN** 开发者执行发布流程
- **THEN** 文档应明确说明两个发布渠道：
  1. GitHub Releases（自动，通过 Git tag 触发）
  2. VSCode Marketplace（手动或自动，通过 `vsce publish` 或集成到 Actions）
- **AND** 说明两者的执行顺序和依赖关系

#### Scenario: 文档包含故障排查指南

- **WHEN** GitHub Actions 发布失败
- **THEN** 文档应提供常见问题的排查步骤：
  - 如何查看 Actions 日志
  - 如何删除错误的 Release
  - 如何重新触发工作流
  - 如何手动构建和上传 VSIX

