# Beyond Compare Integration Specification Delta

## ADDED Requirements

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


