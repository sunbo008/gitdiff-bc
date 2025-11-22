# Beyond Compare Integration Specification

## ADDED Requirements

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

