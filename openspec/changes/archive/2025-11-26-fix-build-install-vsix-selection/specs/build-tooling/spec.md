## ADDED Requirements

### Requirement: 构建安装脚本应在构建前清理旧的 VSIX 文件
构建安装脚本 `build-and-install.sh` SHALL 在执行构建命令前删除 `dist/` 目录中所有现有的 VSIX 文件，确保构建后只包含最新版本。

#### Scenario: 构建前清理旧的 VSIX 文件
- **GIVEN** `dist/` 目录中存在一个或多个旧的 `*.vsix` 文件
- **WHEN** 脚本执行到步骤 3/8 "编译和打包"
- **AND** 在执行 `npm run package` 之前
- **THEN** 脚本应删除 `dist/` 目录中所有 `*.vsix` 文件
- **AND** 使用 `rm -f dist/*.vsix` 命令（忽略不存在的情况）

#### Scenario: 首次构建时 dist 目录为空
- **GIVEN** `dist/` 目录不存在或为空
- **WHEN** 脚本执行清理步骤
- **THEN** 清理命令应静默成功（不报错）
- **AND** 继续执行后续的构建步骤

#### Scenario: 构建后只包含最新的 VSIX
- **GIVEN** 清理步骤已执行
- **WHEN** `npm run package` 构建完成
- **THEN** `dist/` 目录应只包含一个 VSIX 文件
- **AND** 该文件是刚构建的最新版本

### Requirement: 构建安装脚本应选择最新构建的 VSIX 文件
构建安装脚本 `build-and-install.sh` SHALL 在安装步骤中选择最新构建的 VSIX 文件，作为双重保险机制。

#### Scenario: 多个 VSIX 文件存在时选择最新的
- **WHEN** `dist/` 目录中存在多个 `gitdiff-bc-*.vsix` 文件（例如清理失败）
- **AND** 脚本执行到安装步骤（步骤 7/8）
- **THEN** 脚本应按文件修改时间倒序排列（使用 `ls -t`）
- **AND** 选择修改时间最新的 VSIX 文件进行安装
- **AND** 而非按字母顺序选择第一个文件

#### Scenario: 单个 VSIX 文件时正常安装
- **WHEN** `dist/` 目录中只有一个 `gitdiff-bc-*.vsix` 文件（正常情况）
- **THEN** 脚本应选择该文件进行安装
- **AND** 行为与之前保持一致

#### Scenario: 构建后立即安装最新版本
- **GIVEN** 脚本在步骤 3/8 清理旧文件并执行 `npm run package` 构建新的 VSIX
- **WHEN** 脚本执行到步骤 7/8 安装 VSIX
- **THEN** 应安装刚构建的最新版本
- **AND** 不会有旧版本文件的干扰

