## ADDED Requirements

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











