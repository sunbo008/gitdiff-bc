# Change: 增加选择两个文件进行比较的功能

## Why

当前扩展只支持将文件与 Git HEAD 版本进行比较,但用户在日常开发中经常需要比较工作区中的两个任意文件(例如:比较两个不同分支 checkout 出来的文件、比较配置文件的两个版本、比较不同项目中的相似文件等)。增加此功能可以让用户在不离开编辑器的情况下,使用 Beyond Compare 比较任意两个文件,提升工作效率。

## What Changes

- **方式1(推荐)**: 支持同时选中两个文件,右键直接比较
  - 用户按住 Ctrl/Cmd 同时选择两个文件
  - 右键时菜单显示"比较选中的文件"命令(仅在选中2个文件时显示)
  - 直接启动 Beyond Compare 比较两个文件
  - 选中非2个文件时,该命令不显示在菜单中
- **方式2(备选)**: 支持分两步选择文件进行比较
  - 新增"选择此文件进行比较"命令,标记第一个待比较文件(仅在单选文件时显示)
  - 新增"与已选文件比较"命令,将当前文件与之前标记的文件进行比较(仅在已选择第一个文件时显示)
  - 在状态栏显示当前已选择的待比较文件(可点击清除选中)
- 在资源管理器右键菜单中添加上述命令选项
- 支持通过 Beyond Compare 比较两个任意文件,无需 Git 仓库依赖

## Impact

- **Affected specs**: beyondcompare-integration
- **Affected code**: 
  - `src/commands/` - 新增 `compareTwoFiles.ts` 命令文件
  - `src/extension.ts` - 注册新命令和管理选中文件状态
  - `package.json` - 添加新命令和菜单贡献点
  - `package.nls.json` 和 `package.nls.zh-cn.json` - 添加国际化文本
- **User-facing**: 用户可以通过右键菜单选择两个文件进行比较,不再局限于与 Git HEAD 比较

