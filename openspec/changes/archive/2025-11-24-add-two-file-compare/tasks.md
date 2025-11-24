# Tasks

## 1. 实现核心功能

- [x] 1.1 创建 `src/commands/compareTwoFiles.ts` 文件,实现三个命令函数:
  - [x] `compareSelectedFiles(uri, uris)`: 处理多选文件直接比较(方式1,推荐)
  - [x] `selectFirstFile(uri)`: 标记第一个待比较文件(方式2,备选)
  - [x] `compareWithSelectedFile(uri)`: 将当前文件与已选文件比较(方式2,备选)
- [x] 1.2 在 `compareSelectedFiles` 中:
  - [x] 获取 `uris` 参数(VSCode 多选时会传递所有选中的文件)
  - [x] 直接使用前两个文件调用 Beyond Compare 比较(菜单条件已保证选中2个文件)
- [x] 1.3 在 `src/extension.ts` 中添加全局状态变量存储第一个选中的文件路径(用于方式2)
- [x] 1.4 实现文件选择状态的存储和清除逻辑(用于方式2):
  - [x] 选择第一个文件时,保存路径并设置 `firstFileSelected` 上下文为 true
  - [x] 比较完成或清除时,清空路径并设置 `firstFileSelected` 上下文为 false
- [x] 1.5 创建状态栏管理模块(用于方式2):
  - [x] 创建 `StatusBarItem` 显示已选文件名
  - [x] 设置状态栏项的文本、图标、工具提示
  - [x] 注册状态栏项的点击命令,执行清除选中操作
  - [x] 根据选中状态动态显示/隐藏状态栏项
- [x] 1.6 实现调用 Beyond Compare 比较两个文件的逻辑(复用现有的 `BeyondComparePath.launchCompare`)

## 2. 注册命令和菜单

- [x] 2.1 在 `package.json` 中注册三个新命令:
  - [x] `extension.compareSelectedFiles` (主要命令,支持多选)
  - [x] `extension.selectFirstFile` (备选方式)
  - [x] `extension.compareWithSelectedFile` (备选方式)
- [x] 2.2 在 `package.json` 的 `menus.explorer/context` 中添加菜单项:
  - [x] "比较选中的文件"命令(仅文件可见,对应 `compareSelectedFiles`)
  - [x] "选择此文件进行比较"命令(仅文件可见,对应 `selectFirstFile`)
  - [x] "与已选文件比较"命令(仅文件可见,且仅在已选择第一个文件时显示,对应 `compareWithSelectedFile`)
- [x] 2.3 研究 VSCode 菜单的 `when` 条件,实现:
  - [x] 使用 `listMultiSelection` 上下文变量检测是否多选
  - [x] 使用自定义 `setContext` 来精确控制:
    - [x] 使用 VSCode 内置 `listMultiSelection` 检测多选(更可靠)
    - [x] 设置 `firstFileSelected` 上下文(已选择第一个待比较文件时为 true)
  - [x] 确保"比较选中的文件"仅在 `twoFilesSelected` 为 true 时显示
  - [x] 确保"与已选文件比较"仅在 `firstFileSelected` 为 true 时显示
- [x] 2.4 在 `src/extension.ts` 中注册命令到 VSCode

## 3. 国际化支持

- [x] 3.1 在 `package.nls.json` 中添加英文文本:
  - [x] 命令标题
  - [x] 菜单项标题
  - [x] 提示消息
- [x] 3.2 在 `package.nls.zh-cn.json` 中添加中文文本

## 4. 错误处理和用户体验

- [x] 4.1 添加文件类型验证(确保两个文件都存在)
- [x] 4.2 实现友好的错误提示:
  - [x] 选择了同一个文件(方式2)
  - [x] 防御性检查:如果菜单条件失效,执行命令时状态为空的情况
- [x] 4.3 比较完成后自动清除选中状态的选项
- [x] 4.4 添加日志记录关键操作

## 5. 增强功能

- [x] 5.1 在状态栏显示当前已选中的第一个文件:
  - [x] 选择第一个文件后,在状态栏显示文件名(如 "$(file) config.json")
  - [x] 状态栏项可点击,点击后清除选中状态
  - [x] 清除选中后,状态栏项自动隐藏
  - [x] 添加工具提示(tooltip):"点击清除选中的文件"
- [x] 5.2 支持通过命令面板(Command Palette)调用命令

## 6. 测试和文档

- [x] 6.1 手动测试方式1(多选直接比较):
  - [x] 按住 Ctrl/Cmd 同时选中两个文件,右键确认菜单显示"比较选中的文件"
  - [x] 点击命令,确认 Beyond Compare 正常启动
  - [x] 选中三个或更多文件,右键确认"比较选中的文件"命令不显示
  - [x] 只选中一个文件,右键确认"比较选中的文件"命令不显示
  - [x] 未选中任何文件,在空白处右键确认命令不显示
- [x] 6.2 手动测试方式2(分步选择):
  - [x] 未选择第一个文件时,右键确认"与已选文件比较"命令不显示,状态栏无显示
  - [x] 选择第一个文件,确认状态栏显示已选文件名(如 "$(file) config.json")
  - [x] 鼠标悬停状态栏项,确认显示工具提示"点击清除选中的文件"
  - [x] 点击状态栏项,确认状态栏项消失,"与已选文件比较"命令不再显示
  - [x] 重新选择第一个文件,右键其他文件,确认"与已选文件比较"命令显示并包含第一个文件名
  - [x] 选择第二个文件并比较,确认 Beyond Compare 正常启动
  - [x] 比较完成后,确认状态已清除,状态栏项消失,"与已选文件比较"命令不再显示
  - [x] 尝试选择同一个文件两次,确认有提示
- [x] 6.3 跨平台测试(Windows/macOS/Linux)
- [x] 6.4 更新 `README.md` 添加功能说明,重点说明多选方式
- [x] 6.5 更新 `CHANGELOG.md` 记录新功能

