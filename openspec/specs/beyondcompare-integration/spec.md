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

### Requirement: 两个文件比较

扩展 SHALL 支持用户选择工作区中的任意两个文件,并使用 Beyond Compare 进行比较,无需依赖 Git 仓库。支持两种选择方式:同时多选两个文件直接比较,或分两步依次选择文件进行比较。

#### Scenario: 同时选中两个文件直接比较

- **WHEN** 用户在资源管理器中按住 Ctrl/Cmd 同时选中两个文件
- **AND** 右键点击其中任一文件
- **AND** 选择"比较选中的文件"命令
- **THEN** 扩展应检测到有两个文件被选中
- **AND** 使用 Beyond Compare 直接比较这两个文件
- **AND** 第一个选中的文件显示在 Beyond Compare 左侧面板
- **AND** 第二个选中的文件显示在 Beyond Compare 右侧面板

#### Scenario: 选中非两个文件时菜单不显示

- **WHEN** 用户在资源管理器中选中一个文件、三个或更多文件
- **AND** 右键点击
- **THEN** "比较选中的文件"命令不应出现在上下文菜单中
- **AND** 保持菜单简洁，避免显示不可用的选项

#### Scenario: 选择第一个文件

- **WHEN** 用户在资源管理器中右键点击一个文件
- **AND** 选择"选择此文件进行比较"命令
- **THEN** 扩展应将该文件路径保存为第一个待比较文件
- **AND** 显示成功提示消息,告知用户已选择该文件
- **AND** 提示用户选择第二个文件进行比较

#### Scenario: 选择第二个文件并比较

- **WHEN** 用户已选择第一个文件
- **AND** 用户在资源管理器中右键点击另一个文件
- **AND** 选择"与已选文件比较"命令
- **THEN** 扩展应使用 Beyond Compare 比较两个文件
- **AND** 第一个文件显示在 Beyond Compare 左侧面板
- **AND** 第二个文件显示在 Beyond Compare 右侧面板
- **AND** 比较完成后,扩展应清除已选文件状态(或提供清除选项)

#### Scenario: 防御性检查 - 未选择第一个文件时执行命令

- **WHEN** 由于异常情况,"与已选文件比较"命令被执行但第一个文件状态为空
- **THEN** 扩展应记录错误日志
- **AND** 显示错误提示"请先选择第一个文件进行比较"
- **AND** 不启动 Beyond Compare
- **NOTE**: 正常情况下此场景不应发生,因为菜单条件已控制命令可见性

#### Scenario: 选择相同文件

- **WHEN** 用户选择第一个文件后
- **AND** 再次选择同一个文件作为第二个文件进行比较
- **THEN** 扩展应显示警告提示"不能比较同一个文件"
- **AND** 不启动 Beyond Compare
- **AND** 保持第一个文件的选中状态

#### Scenario: 文件不存在

- **WHEN** 用户选择第一个文件后,该文件被删除或移动
- **AND** 用户尝试选择第二个文件进行比较
- **THEN** 扩展应检测到第一个文件不存在
- **AND** 显示错误提示"第一个选中的文件已不存在,请重新选择"
- **AND** 清除已选文件状态

#### Scenario: Beyond Compare 启动失败

- **WHEN** 用户选择两个文件进行比较
- **AND** Beyond Compare 无法启动(如未安装、路径错误)
- **THEN** 扩展应显示友好的错误提示
- **AND** 错误消息应包含具体的失败原因
- **AND** 保持已选文件状态,允许用户修复问题后重试

### Requirement: 两个文件比较的右键菜单集成

扩展 SHALL 在资源管理器右键菜单中添加两个文件比较相关的命令选项,根据选中文件数量智能显示合适的命令。

#### Scenario: "比较选中的文件"菜单仅在选中两个文件时显示

- **WHEN** 用户在资源管理器中同时选中恰好两个文件
- **AND** 右键点击其中任一文件
- **THEN** 上下文菜单应包含"比较选中的文件"选项
- **AND** 该选项应位于合理的菜单分组中(建议与其他比较命令同组)
- **AND** 该选项应始终可用且可点击

#### Scenario: 选中非两个文件时菜单隐藏

- **WHEN** 用户选中多于两个文件、只选中一个文件、或未选中文件
- **AND** 右键点击
- **THEN** "比较选中的文件"选项不应出现在上下文菜单中

#### Scenario: "选择此文件进行比较"菜单仅在单选时显示

- **WHEN** 用户在资源管理器中右键点击单个文件(未多选)
- **THEN** 上下文菜单应包含"选择此文件进行比较"选项
- **AND** 该选项应位于合理的菜单分组中(建议与其他比较命令同组)
- **AND** 该选项仅在右键文件时显示,文件夹不显示

#### Scenario: "选择此文件进行比较"菜单在多选时隐藏

- **WHEN** 用户在资源管理器中同时选中多个文件
- **AND** 右键点击其中任一文件
- **THEN** "选择此文件进行比较"选项不应出现在上下文菜单中
- **AND** 避免与"比较选中的文件"命令混淆

#### Scenario: "与已选文件比较"菜单仅在已选第一个文件时显示

- **WHEN** 用户在资源管理器中右键点击文件
- **AND** 已经通过"选择此文件进行比较"命令选择了第一个文件
- **THEN** 上下文菜单应包含"与已选文件比较"选项
- **AND** 菜单项应显示已选文件的文件名(如"与 config.json 比较")
- **AND** 该选项仅在右键文件时显示,文件夹不显示

#### Scenario: "与已选文件比较"菜单在未选第一个文件时隐藏

- **WHEN** 用户在资源管理器中右键点击文件
- **AND** 尚未选择第一个文件(或已清除选择)
- **THEN** "与已选文件比较"选项不应出现在上下文菜单中

### Requirement: 选中文件状态管理

扩展 SHALL 管理用户选中的第一个文件的状态,并提供清除状态的机制。

#### Scenario: 状态持久化

- **WHEN** 用户选择第一个文件后
- **AND** 用户切换到其他编辑器标签或窗口
- **THEN** 已选文件状态应保持不变
- **AND** 用户返回后仍可选择第二个文件进行比较

#### Scenario: 比较完成后清除状态

- **WHEN** 用户成功比较两个文件
- **THEN** 扩展应自动清除已选文件状态
- **OR** 显示提示消息,询问用户是否清除已选文件

#### Scenario: 手动清除状态

- **WHEN** 用户选择第一个文件后改变主意
- **THEN** 扩展应提供"清除选中文件"命令(可选)
- **OR** 允许用户通过重新选择另一个文件覆盖当前选中

#### Scenario: 窗口关闭时状态清除

- **WHEN** 用户关闭 VSCode 窗口或重启编辑器
- **THEN** 已选文件状态应被清除
- **AND** 不应持久化到磁盘或跨会话保存

### Requirement: 状态栏显示和交互

扩展 SHALL 在状态栏显示当前已选择的第一个文件,并支持通过点击清除选中状态。

#### Scenario: 选择第一个文件后状态栏显示

- **WHEN** 用户通过"选择此文件进行比较"命令选择第一个文件
- **THEN** 状态栏左侧应显示一个状态栏项
- **AND** 状态栏项应显示文件图标和文件名(如 "$(file) config.json")
- **AND** 状态栏项应有工具提示"点击清除选中的文件"
- **AND** 状态栏项应可点击

#### Scenario: 点击状态栏项清除选中

- **WHEN** 用户点击状态栏上的文件名
- **THEN** 扩展应清除第一个文件的选中状态
- **AND** 状态栏项应立即隐藏
- **AND** 设置 `firstFileSelected` 上下文为 false
- **AND** "与已选文件比较"命令应从菜单中消失

#### Scenario: 比较完成后自动隐藏状态栏项

- **WHEN** 用户成功完成两个文件的比较
- **THEN** 扩展应自动清除选中状态
- **AND** 状态栏项应自动隐藏

#### Scenario: 未选择第一个文件时状态栏不显示

- **WHEN** 用户未执行"选择此文件进行比较"命令
- **OR** 已清除选中状态
- **THEN** 状态栏不应显示文件选择相关的状态栏项

### Requirement: 用户反馈和提示

扩展 SHALL 在用户执行两个文件比较操作时提供清晰的反馈和提示消息。

#### Scenario: 选择第一个文件时的提示

- **WHEN** 用户成功选择第一个文件
- **THEN** 扩展应显示信息提示消息
- **AND** 消息应包含已选文件的名称
- **AND** 消息应引导用户下一步操作(如"请选择第二个文件进行比较")

#### Scenario: 比较启动时的进度提示

- **WHEN** 用户选择第二个文件并开始比较
- **THEN** 扩展应显示进度提示(如"正在启动 Beyond Compare...")
- **AND** 操作完成后提示应自动消失

#### Scenario: 错误提示的清晰性

- **WHEN** 操作失败(如文件不存在、Beyond Compare 启动失败)
- **THEN** 扩展应显示清晰的错误消息
- **AND** 错误消息应说明失败原因
- **AND** 错误消息应提供解决建议(如"请检查文件是否存在")

### Requirement: 国际化支持

扩展的两个文件比较功能 SHALL 支持中英文国际化。

#### Scenario: 英文环境显示英文文本

- **WHEN** VSCode 的显示语言设置为英文
- **THEN** 命令名称、菜单项、提示消息应显示英文
- **AND** 例如:"Select this file to compare"、"Compare with selected file"

#### Scenario: 中文环境显示中文文本

- **WHEN** VSCode 的显示语言设置为简体中文
- **THEN** 命令名称、菜单项、提示消息应显示中文
- **AND** 例如:"选择此文件进行比较"、"与已选文件比较"

#### Scenario: 动态显示已选文件名

- **WHEN** 菜单项需要显示已选文件名称
- **THEN** 文件名应正确嵌入国际化文本中
- **AND** 例如:中文显示"与 config.json 比较",英文显示"Compare with config.json"

### Requirement: 终端文件路径比较

扩展 SHALL 支持在终端右键菜单中比较 `git status` 输出的文件与 Git HEAD，支持单个文件和批量多个文件比较。

#### Scenario: 在 git status 输出中右键比较文件

- **WHEN** 用户在终端运行 `git status` 命令
- **AND** 用户**选中**了包含文件路径的文本（如 `platform/mac/App.mm`）
- **AND** 用户右键选择"与 Git HEAD 比较文件"命令
- **THEN** 扩展应**自动执行复制操作**获取选中文本
- **AND** 解析文本中的文件路径
- **AND** 验证文件存在且在 Git 仓库中
- **AND** 使用 Beyond Compare 比较该文件与 Git HEAD

#### Scenario: 未选中文本时的处理

- **WHEN** 用户右键点击但未选中文本
- **AND** 自动复制操作未获取到有效路径
- **THEN** 扩展应显示输入框："未能自动获取选中文本，请粘贴要比较的文件路径"
- **AND** 允许用户手动输入或粘贴路径
- **AND** 验证并执行比较

#### Scenario: 路径解析支持多种格式

- **WHEN** 终端输出包含不同格式的文件路径
- **THEN** 扩展应正确解析以下格式：
  - `modified:   path/to/file.ts` - 带 git status 前缀
  - `new file:   path/to/file.ts` - 新文件格式
  - `    path/to/file.ts` - 带缩进的路径
  - `path/to/file.ts` - 纯路径
  - `path/to/file with spaces.ts` - 包含空格的路径
- **AND** 去除前导/尾随空白和 git 状态前缀
- **AND** 提取出完整的相对文件路径

#### Scenario: 右键点击非文件路径时不显示菜单

- **WHEN** 用户在终端中右键点击，但光标所在行不包含有效的文件路径
- **OR** 解析出的路径不是工作区中的文件
- **OR** 文件不在 Git 仓库中
- **THEN** "与 Git HEAD 比较文件"菜单项不应显示
- **OR** 点击后显示提示："未检测到有效的文件路径"

#### Scenario: 多工作区环境中的路径解析

- **WHEN** 用户有多个工作区文件夹
- **AND** 在终端中右键点击文件路径
- **THEN** 扩展应尝试从终端的当前工作目录确定所属工作区
- **AND** 如果无法确定，应在所有工作区中搜索匹配的文件
- **AND** 如果找到多个匹配，使用第一个匹配的文件
- **AND** 如果未找到匹配，显示错误："文件不在工作区中"

#### Scenario: 支持相对路径和绝对路径

- **WHEN** 终端输出包含相对路径（相对于 Git 仓库根目录）
- **THEN** 扩展应将其转换为绝对路径进行验证和比较
- **WHEN** 终端输出包含绝对路径
- **THEN** 扩展应直接使用该路径，验证其在工作区中

#### Scenario: 错误处理与用户提示

- **WHEN** 解析出的文件路径不存在
- **THEN** 扩展应显示错误："文件不存在: {path}"
- **WHEN** 文件存在但不在 Git 仓库中
- **THEN** 扩展应显示错误："文件不在 Git 版本控制中"
- **WHEN** Git 仓库不存在或损坏
- **THEN** 扩展应显示错误："当前目录不是 Git 仓库"
- **AND** 错误提示应与资源管理器中的文件比较错误提示保持一致

### Requirement: 终端批量文件比较

扩展 SHALL 支持在终端中选中多行文本，批量比较所有有效文件与 Git HEAD。

#### Scenario: 选中多个文件路径并批量比较

- **WHEN** 用户在终端中选中多行文本（如 git status 输出的多个文件）
- **AND** 选中的文本包含多个有效的文件路径
- **AND** 用户右键选择"与 Git HEAD 比较文件"命令
- **THEN** 扩展应检测到有选中文本
- **AND** 解析选中文本中的所有文件路径（逐行提取）
- **AND** 过滤出所有存在且在 Git 仓库中的有效文件
- **AND** 依次对每个有效文件启动 Beyond Compare 进行比较
- **AND** 显示进度提示："正在比较第 {current}/{total} 个文件: {filename}"
- **AND** 完成后显示摘要："成功比较 {success} 个文件"

#### Scenario: 批量比较中包含部分无效路径

- **WHEN** 选中的文本包含一些有效路径和一些无效路径
- **OR** 某些行不包含文件路径（如空行、注释行）
- **THEN** 扩展应仅比较有效的文件
- **AND** 跳过无效路径，不显示错误（避免打断流程）
- **AND** 在日志中记录："跳过无效路径: {invalidPath}"
- **AND** 完成后显示摘要："成功比较 {success} 个文件，跳过 {skipped} 个无效路径"

#### Scenario: 批量比较文件数量限制

- **WHEN** 用户选中的文本包含超过 20 个有效文件路径
- **THEN** 扩展应显示确认对话框："检测到 {count} 个文件，是否继续批量比较？这可能会打开多个 Beyond Compare 窗口"
- **AND** 提供"继续"和"取消"选项
- **WHEN** 用户选择"取消"
- **THEN** 扩展应中止操作，不启动任何比较
- **WHEN** 用户选择"继续"
- **THEN** 扩展应继续执行批量比较

#### Scenario: 用户取消批量比较进度

- **WHEN** 批量比较正在进行中（如正在比较第 5/20 个文件）
- **AND** 进度提示显示"取消"按钮
- **AND** 用户点击"取消"按钮
- **THEN** 扩展应停止后续文件的比较
- **AND** 已启动的 Beyond Compare 窗口保持打开（不关闭已打开的窗口）
- **AND** 显示提示："已取消，已比较 {completed} 个文件"

#### Scenario: 批量比较与单文件比较的切换

- **WHEN** 用户在终端右键点击，且有文本被选中
- **THEN** 命令自动进入批量比较模式
- **WHEN** 用户在终端右键点击，且没有文本被选中
- **THEN** 命令自动进入单文件比较模式（解析光标所在行）
- **AND** 两种模式使用相同的菜单项"与 Git HEAD 比较文件"
- **AND** 用户无需手动选择模式

#### Scenario: 批量比较的顺序执行

- **WHEN** 批量比较多个文件
- **THEN** 扩展应按照文件在选中文本中的顺序依次启动 Beyond Compare
- **AND** 不应并行启动多个 Beyond Compare 进程（避免资源占用过高）
- **AND** 等待上一个 Beyond Compare 启动完成后，再启动下一个
- **AND** 超时时间设置为 2 秒（避免无限等待）

### Requirement: 终端右键菜单集成

扩展 SHALL 在 VSCode 终端的右键菜单中注册文件比较命令，并优化显示位置。

#### Scenario: 菜单项显示位置

- **WHEN** 用户在 VSCode 终端中右键点击
- **THEN** 右键菜单应包含"与 Git HEAD 比较文件"选项
- **AND** 该选项应显示在菜单的最底部（`z_commands` 分组）
- **AND** 避免干扰常用的复制/粘贴操作

#### Scenario: 终端获得焦点时显示菜单项

- **WHEN** 用户在 VSCode 终端中右键点击

- **WHEN** 用户在 VSCode 终端中右键点击
- **THEN** 右键菜单应包含"与 Git HEAD 比较文件"选项
- **AND** 该选项应位于合理的菜单分组中
- **AND** 命令名称应与资源管理器中的文件比较命令完全一致

#### Scenario: 非终端环境不显示菜单项

- **WHEN** 用户在编辑器、资源管理器或其他非终端面板中右键点击
- **THEN** "与 Git HEAD 比较文件"选项不应在这些位置的右键菜单中显示（避免重复）

#### Scenario: 命令执行反馈

- **WHEN** 用户从终端右键菜单选择比较命令
- **THEN** 扩展应显示进度提示："正在解析文件路径..."
- **AND** 解析完成后显示："正在启动 Beyond Compare..."
- **AND** 成功启动后，进度提示自动消失
- **AND** 失败时显示清晰的错误消息

### Requirement: 终端路径解析器

扩展 SHALL 提供专用的终端路径解析工具，从终端文本中提取文件路径。

#### Scenario: 从终端行提取文件路径

- **WHEN** 给定终端的一行文本
- **THEN** 解析器应识别并提取文件路径
- **AND** 支持常见的文件路径模式：
  - Unix 风格：`path/to/file.ext`
  - Windows 风格：`path\to\file.ext` 或 `C:\path\to\file.ext`
  - 混合风格：`C:/path/to/file.ext`
- **AND** 忽略非路径内容（行号、git 状态提示等）

#### Scenario: 清理路径前缀和后缀

- **WHEN** 文件路径带有 git status 前缀（如 `modified:   `）
- **THEN** 解析器应去除这些前缀，仅保留文件路径
- **WHEN** 文件路径前后有空白字符或制表符
- **THEN** 解析器应去除这些空白，仅保留干净的路径
- **WHEN** 行中包含注释或其他后缀内容
- **THEN** 解析器应仅提取文件路径部分

#### Scenario: 路径验证

- **WHEN** 解析出候选文件路径
- **THEN** 解析器应验证该路径是否指向存在的文件
- **AND** 验证该文件是否在当前工作区中
- **AND** 验证该文件是否在 Git 仓库中
- **AND** 如果任一验证失败，返回 null 或错误

#### Scenario: 支持工作区相对路径

- **WHEN** 解析出的路径是相对路径
- **THEN** 解析器应尝试相对于以下基准路径解析：
  1. 终端当前工作目录（如果可获取）
  2. 第一个工作区根目录
  3. Git 仓库根目录
- **AND** 返回第一个找到的有效文件的绝对路径

### Requirement: 终端比较国际化支持

扩展的终端文件比较功能 SHALL 支持中英文国际化。

#### Scenario: 命令名称国际化

- **WHEN** VSCode 显示语言为英文
- **THEN** 终端右键菜单应显示 "Compare File with Git HEAD"
- **WHEN** VSCode 显示语言为简体中文
- **THEN** 终端右键菜单应显示 "与 Git HEAD 比较文件"
- **AND** 命令名称应复用现有的国际化键值

#### Scenario: 错误提示国际化

- **WHEN** 终端路径解析失败或文件比较失败
- **THEN** 错误消息应根据当前语言显示
- **AND** 复用现有的错误提示国际化文本
- **AND** 例如：中文 "未检测到有效的文件路径"，英文 "No valid file path detected"

#### Scenario: 进度提示国际化

- **WHEN** 显示操作进度提示
- **THEN** 提示消息应根据当前语言显示
- **AND** 例如：中文 "正在解析文件路径..."，英文 "Parsing file path..."

### Requirement: Git Revert 文件功能

扩展 SHALL 支持通过右键菜单撤销文件的工作区修改,将文件恢复到 Git HEAD 版本。

#### Scenario: 右键文件执行 revert

- **WHEN** 用户在资源管理器中右键点击已修改的文件
- **AND** 选择"撤销对文件的修改"命令
- **THEN** 扩展应显示确认对话框
- **AND** 对话框应显示文件名和警告信息:"此操作将放弃所有未提交的修改,无法撤销"
- **AND** 提供"确认"和"取消"按钮
- **WHEN** 用户点击"确认"
- **THEN** 扩展应执行 `git restore <file>` (Git 2.23+) 或 `git checkout HEAD -- <file>`
- **AND** 文件应恢复到 Git HEAD 版本
- **AND** 显示成功提示:"文件已恢复到 HEAD 版本"

#### Scenario: 撤销未修改的文件

- **WHEN** 用户尝试 revert 一个未修改的文件(与 HEAD 相同)
- **THEN** 扩展应检测到文件未被修改
- **AND** 显示信息提示:"文件未被修改,无需撤销"
- **AND** 不执行 Git 命令

#### Scenario: 撤销未跟踪的新文件

- **WHEN** 用户尝试 revert 一个 Git 未跟踪的新文件
- **THEN** 扩展应显示错误提示:"文件未纳入 Git 版本控制,无法撤销修改"
- **AND** 不执行 Git 命令

#### Scenario: 用户取消 revert 操作

- **WHEN** 用户在确认对话框中点击"取消"
- **THEN** 扩展应中止操作
- **AND** 不执行任何 Git 命令
- **AND** 不显示任何提示消息

#### Scenario: Git 命令执行失败

- **WHEN** Git revert 命令执行失败(如权限问题、仓库损坏)
- **THEN** 扩展应捕获错误
- **AND** 显示错误提示,包含具体的失败原因
- **AND** 在日志中记录详细的错误信息

### Requirement: Git Revert 文件夹功能

扩展 SHALL 支持通过右键菜单撤销文件夹中所有文件的工作区修改,将文件夹恢复到 Git HEAD 版本。

#### Scenario: 右键文件夹执行 revert

- **WHEN** 用户在资源管理器中右键点击文件夹
- **AND** 该文件夹中有已修改的文件
- **AND** 选择"撤销对文件夹的修改"命令
- **THEN** 扩展应检测文件夹中所有已修改的文件
- **AND** 显示确认对话框
- **AND** 对话框应列出将要撤销的文件数量(如"将撤销 3 个文件的修改")
- **AND** 对话框应显示警告信息:"此操作将放弃文件夹中所有未提交的修改,无法撤销"
- **WHEN** 用户点击"确认"
- **THEN** 扩展应执行 `git restore <folder>` 或 `git checkout HEAD -- <folder>`
- **AND** 文件夹中所有修改的文件应恢复到 Git HEAD 版本
- **AND** 显示成功提示:"已恢复 N 个文件到 HEAD 版本"

#### Scenario: 撤销未修改的文件夹

- **WHEN** 用户尝试 revert 一个文件夹
- **AND** 文件夹中没有任何修改的文件
- **THEN** 扩展应检测到无需撤销
- **AND** 显示信息提示:"文件夹中没有修改的文件,无需撤销"
- **AND** 不执行 Git 命令

#### Scenario: 递归撤销子文件夹

- **WHEN** 用户 revert 一个文件夹
- **AND** 该文件夹的子文件夹中也有修改的文件
- **THEN** 扩展应递归处理所有子文件夹
- **AND** 撤销所有修改的文件(包括子文件夹中的文件)
- **AND** 成功提示应显示总共撤销的文件数量

### Requirement: 终端 Git Revert 功能

扩展 SHALL 支持在终端右键菜单中解析文件路径并执行 revert 操作。

#### Scenario: 从终端右键 revert 文件

- **WHEN** 用户在终端运行 `git status` 命令
- **AND** 用户选中包含文件路径的文本(如 `modified: src/file.ts`)
- **AND** 用户右键选择"撤销文件修改"命令
- **THEN** 扩展应自动复制选中文本
- **AND** 解析文件路径(去除 `modified:` 等前缀)
- **AND** 验证文件存在且在 Git 仓库中
- **AND** 显示确认对话框:"确认撤销文件 'src/file.ts' 的修改?"
- **WHEN** 用户确认
- **THEN** 扩展应执行 revert 操作
- **AND** 显示成功提示

#### Scenario: 终端批量 revert 多个文件

- **WHEN** 用户在终端选中多行文本
- **AND** 选中的文本包含多个文件路径
- **AND** 用户右键选择"撤销文件修改"命令
- **THEN** 扩展应解析所有有效的文件路径
- **AND** 显示确认对话框:"确认撤销 N 个文件的修改?"
- **AND** 对话框应列出所有将要撤销的文件名
- **WHEN** 用户确认
- **THEN** 扩展应依次撤销所有文件
- **AND** 显示进度提示:"正在撤销第 M/N 个文件..."
- **AND** 完成后显示摘要:"成功撤销 N 个文件的修改"

#### Scenario: 终端未选中文本时的处理

- **WHEN** 用户在终端右键但未选中文本
- **AND** 自动复制操作未获取到有效路径
- **THEN** 扩展应显示输入框:"未能自动获取选中文本,请粘贴要撤销的文件路径"
- **AND** 允许用户手动输入或粘贴路径
- **AND** 验证路径后执行 revert 操作

#### Scenario: 终端 revert 路径解析错误

- **WHEN** 终端选中的文本不包含有效的文件路径
- **OR** 解析出的路径不存在或不在 Git 仓库中
- **THEN** 扩展应显示错误提示:"未检测到有效的文件路径"
- **AND** 不执行任何操作

### Requirement: Git Revert 右键菜单集成

扩展 SHALL 在资源管理器和终端的右键菜单中添加 revert 相关命令。

#### Scenario: 资源管理器文件菜单显示 revert

- **WHEN** 用户在资源管理器中右键点击文件
- **THEN** 上下文菜单应包含"撤销对文件的修改"选项
- **AND** 该选项应位于合理的菜单分组中(建议与其他 Git 操作同组)
- **AND** 菜单项应使用恰当的图标(如撤销图标)

#### Scenario: 资源管理器文件夹菜单显示 revert

- **WHEN** 用户在资源管理器中右键点击文件夹
- **THEN** 上下文菜单应包含"撤销对文件夹的修改"选项
- **AND** 该选项应位于合理的菜单分组中
- **AND** 文件右键菜单不应显示此文件夹命令

#### Scenario: 终端菜单显示 revert

- **WHEN** 用户在终端中右键点击
- **THEN** 上下文菜单应包含"撤销文件修改"选项
- **AND** 该选项应显示在菜单底部(`z_commands` 分组)
- **AND** 避免干扰常用的复制/粘贴操作

#### Scenario: 菜单项在非 Git 仓库中禁用

- **WHEN** 用户在非 Git 仓库的文件或文件夹上右键
- **THEN** revert 相关菜单项应保持可见(用户体验一致性)
- **AND** 点击后显示错误提示:"当前目录不是 Git 仓库"

### Requirement: Git Revert 确认对话框

扩展 SHALL 在执行 revert 操作前显示确认对话框,防止用户误操作。

#### Scenario: 单文件 revert 确认对话框

- **WHEN** 用户尝试 revert 单个文件
- **THEN** 确认对话框应显示以下信息:
  - 标题:"确认撤销修改"
  - 文件名(完整路径或相对路径)
  - 警告信息:"此操作将放弃所有未提交的修改,无法撤销"
- **AND** 提供"确认"和"取消"按钮
- **AND** "取消"按钮应为默认焦点(安全默认值)

#### Scenario: 文件夹 revert 确认对话框

- **WHEN** 用户尝试 revert 文件夹
- **THEN** 确认对话框应显示以下信息:
  - 标题:"确认撤销文件夹修改"
  - 文件夹名称
  - 将要撤销的文件数量(如"将撤销 5 个文件的修改")
  - 警告信息:"此操作将放弃文件夹中所有未提交的修改,无法撤销"
- **AND** 可选:显示将要撤销的文件列表(如果数量不多,如 ≤10 个)
- **AND** 提供"确认"和"取消"按钮

#### Scenario: 批量 revert 确认对话框

- **WHEN** 用户从终端批量 revert 多个文件
- **THEN** 确认对话框应显示:
  - 标题:"确认批量撤销修改"
  - 文件数量:"将撤销 N 个文件的修改"
  - 文件列表(如果数量适中,如 ≤20 个)
  - 警告信息:"此操作无法撤销"
- **AND** 如果文件数量过多(如 >20 个),显示前 20 个并注明"...还有 N 个文件"
- **AND** 提供"确认"和"取消"按钮

### Requirement: Git Revert 错误处理和用户反馈

扩展 SHALL 提供清晰的错误提示和操作反馈。

#### Scenario: 操作进度提示

- **WHEN** 用户确认执行 revert 操作
- **THEN** 扩展应显示进度提示:"正在撤销修改..."
- **AND** 操作完成后进度提示应自动消失

#### Scenario: 成功提示

- **WHEN** revert 操作成功完成
- **THEN** 扩展应显示成功提示
- **AND** 单文件:"文件已恢复到 HEAD 版本"
- **AND** 文件夹:"已恢复 N 个文件到 HEAD 版本"
- **AND** 批量:"成功撤销 N 个文件的修改"

#### Scenario: 错误提示清晰性

- **WHEN** revert 操作失败
- **THEN** 扩展应显示清晰的错误消息
- **AND** 错误消息应说明失败原因
- **AND** 例如:"Git 命令执行失败: 权限不足"
- **AND** 在日志中记录详细的错误堆栈

#### Scenario: 日志记录详细操作

- **WHEN** 执行 revert 操作
- **THEN** 扩展应在日志中记录:
  - 操作开始:"执行 revert: <file-path>"
  - Git 命令:"执行 Git 命令: git restore <file>"
  - 操作结果:"revert 成功" 或 "revert 失败: <error>"
- **AND** 日志级别应为 INFO(成功)或 ERROR(失败)

### Requirement: Git Revert 国际化支持

扩展的 Git revert 功能 SHALL 支持中英文国际化。

#### Scenario: 英文环境显示英文文本

- **WHEN** VSCode 的显示语言设置为英文
- **THEN** 命令名称应为:"Revert File to HEAD", "Revert Folder to HEAD"
- **AND** 确认对话框应显示英文:"Confirm Revert", "This operation will discard all uncommitted changes and cannot be undone."
- **AND** 提示消息应为英文:"File restored to HEAD version"

#### Scenario: 中文环境显示中文文本

- **WHEN** VSCode 的显示语言设置为简体中文
- **THEN** 命令名称应为:"撤销对文件的修改", "撤销对文件夹的修改"
- **AND** 确认对话框应显示中文:"确认撤销修改", "此操作将放弃所有未提交的修改,无法撤销"
- **AND** 提示消息应为中文:"文件已恢复到 HEAD 版本"

#### Scenario: 动态显示文件名和数量

- **WHEN** 显示包含文件名或数量的消息
- **THEN** 文件名和数量应正确嵌入国际化文本中
- **AND** 例如:中文 "已恢复 3 个文件到 HEAD 版本",英文 "Restored 3 files to HEAD version"

### Requirement: Git Revert 与 Git 版本兼容性

扩展 SHALL 优先使用新版 Git 命令,并在旧版 Git 中回退到兼容命令。

#### Scenario: 使用 git restore 命令(Git 2.23+)

- **WHEN** 系统安装的 Git 版本 ≥ 2.23
- **THEN** 扩展应优先使用 `git restore <file>` 命令
- **AND** 命令应在日志中记录:"使用 git restore 命令"

#### Scenario: 回退到 git checkout 命令(Git < 2.23)

- **WHEN** 系统安装的 Git 版本 < 2.23
- **OR** `git restore` 命令不可用
- **THEN** 扩展应回退到 `git checkout HEAD -- <file>` 命令
- **AND** 命令应在日志中记录:"使用 git checkout 命令(Git 版本 < 2.23)"

#### Scenario: Git 版本检测失败

- **WHEN** 无法检测 Git 版本
- **THEN** 扩展应默认使用 `git checkout HEAD --` 命令(更广泛兼容)
- **AND** 在日志中记录警告:"无法检测 Git 版本,使用默认命令"

