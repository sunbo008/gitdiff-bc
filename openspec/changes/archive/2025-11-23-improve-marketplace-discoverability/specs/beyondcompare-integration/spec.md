## ADDED Requirements

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

