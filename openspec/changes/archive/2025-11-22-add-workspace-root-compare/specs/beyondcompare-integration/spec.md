# Beyond Compare Integration Specification Delta

## ADDED Requirements

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




