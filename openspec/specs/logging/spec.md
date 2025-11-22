# logging Specification

## Purpose
定义扩展的日志系统功能，包括日志输出、级别控制和格式化。日志系统通过 VSCode OutputChannel 和 Console 输出，供用户查看运行时信息和开发者调试使用。
## Requirements
### Requirement: OutputChannel 日志输出
扩展 SHALL 将日志输出到 VSCode OutputChannel，供用户查看运行时信息。

#### Scenario: 初始化 OutputChannel
- **WHEN** 扩展激活时
- **THEN** 创建名为 "Beyond Compare Git" 的 OutputChannel
- **AND** OutputChannel 被添加到扩展的 subscriptions 中

#### Scenario: 输出日志到 OutputChannel
- **WHEN** 记录任意级别的日志时
- **THEN** 日志消息被追加到 OutputChannel
- **AND** 日志格式为 `[时间戳] [级别] 消息内容`

### Requirement: Console 日志输出
扩展 SHALL 将日志输出到 Console，供开发调试使用。

#### Scenario: 输出到 Console
- **WHEN** 记录任意级别的日志时
- **THEN** 日志消息通过 console.log 输出
- **AND** 包含完整的时间戳和级别信息

### Requirement: 日志级别配置
扩展 SHALL 支持通过配置项控制日志输出级别。

#### Scenario: 读取配置的日志级别
- **WHEN** 扩展初始化或配置变更时
- **THEN** 从 `beyondCompare.logLevel` 配置项读取日志级别
- **AND** 支持的级别包括：error, warn, info, debug

#### Scenario: 根据级别过滤日志
- **WHEN** 当前日志级别为 info 时
- **THEN** error、warn、info 级别的日志被输出
- **AND** debug 级别的日志被忽略

### Requirement: 日志方法
扩展 SHALL 提供不同级别的日志记录方法。

#### Scenario: 记录不同级别的日志
- **WHEN** 调用 Logger.error/warn/info/debug 方法时
- **THEN** 根据当前配置的日志级别决定是否输出
- **AND** 支持可变参数，自动格式化对象参数为 JSON

