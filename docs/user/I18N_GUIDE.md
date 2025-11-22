# 国际化支持说明 / Internationalization (i18n) Guide

GitDiff BC 扩展现已支持中英文双语界面，会根据 VSCode/Cursor 的语言设置自动切换显示语言。

The GitDiff BC extension now supports both Chinese and English, automatically switching based on your VSCode/Cursor language settings.

---

## 📋 目录 / Table of Contents

- [用户指南 / User Guide](#用户指南--user-guide)
  - [支持的语言 / Supported Languages](#支持的语言--supported-languages)
  - [如何切换语言 / How to Change Language](#如何切换语言--how-to-change-language)
  - [国际化内容范围 / i18n Coverage](#国际化内容范围--i18n-coverage)
  - [故障排查 / Troubleshooting](#故障排查--troubleshooting)
- [开发者文档 / Developer Documentation](#开发者文档--developer-documentation)
  - [技术实现 / Technical Implementation](#技术实现--technical-implementation)
  - [文件结构 / File Structure](#文件结构--file-structure)
  - [实现清单 / Implementation Checklist](#实现清单--implementation-checklist)
  - [测试指南 / Testing Guide](#测试指南--testing-guide)
  - [添加新语言 / Adding New Languages](#添加新语言--adding-new-languages)

---

## 用户指南 / User Guide

### 支持的语言 / Supported Languages

- 🇨🇳 **简体中文** (Simplified Chinese) - `zh-cn`
- 🇺🇸 **英语** (English) - `en` (默认/default)

### 如何切换语言 / How to Change Language

#### 方法 1：通过命令面板 / Method 1: Via Command Palette

1. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (macOS) 打开命令面板  
   Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (macOS) to open Command Palette

2. 输入并选择 `Configure Display Language`  
   Type and select `Configure Display Language`

3. 选择语言 / Select your language:
   - `zh-cn` - 简体中文
   - `en` - English

4. 重启 VSCode/Cursor  
   Restart VSCode/Cursor

#### 方法 2：编辑配置文件 / Method 2: Edit Configuration File

1. 找到并打开语言配置文件 / Locate and open the language configuration file:
   - Windows: `%APPDATA%\Code\User\locale.json`
   - macOS: `$HOME/Library/Application Support/Code/User/locale.json`
   - Linux: `$HOME/.config/Code/User/locale.json`

2. 设置语言 / Set the language:

**简体中文 / Simplified Chinese:**
```json
{
  "locale": "zh-cn"
}
```

**英语 / English:**
```json
{
  "locale": "en"
}
```

3. 重启 VSCode/Cursor / Restart VSCode/Cursor

### 国际化内容范围 / i18n Coverage

#### ✅ 已国际化的内容 / Internationalized Content

##### 1. 扩展信息 / Extension Information
- 扩展名称 / Extension name
- 扩展描述 / Extension description

##### 2. 命令菜单 / Command Menu
- **中文**: 
  - "与 Git HEAD 比较文件"
  - "与 Git HEAD 比较文件夹"
  - "Beyond Compare Git: 显示日志文件"
  - "Beyond Compare Git: 打开日志目录"

- **English**:
  - "Compare File with Git HEAD"
  - "Compare Folder with Git HEAD"
  - "Beyond Compare Git: Show Log File"
  - "Beyond Compare Git: Open Log Directory"

##### 3. 配置项说明 / Configuration Descriptions
- Beyond Compare 可执行路径配置说明  
  Beyond Compare executable path configuration description
  
- 日志级别配置说明  
  Log level configuration description

##### 4. 运行时消息 / Runtime Messages
- 进度提示 / Progress messages
  - "正在准备比较..." / "Preparing comparison..."
  - "检查 Git 仓库..." / "Checking Git repository..."
  - "启动 Beyond Compare..." / "Launching Beyond Compare..."

- 成功消息 / Success messages
  - "Beyond Compare 已启动" / "Beyond Compare launched"

- 错误消息 / Error messages
  - "当前文件不在 Git 仓库中。" / "Current file is not in a Git repository."
  - "文件不在 Git 版本控制中，无法比较。" / "File is not tracked by Git, cannot compare."

#### 📝 日志保持英文 / Logs Remain in English
- 内部日志消息（便于技术支持）  
  Internal log messages (for technical support)
- 调试信息 / Debug information
- 错误堆栈 / Error stacks

### 故障排查 / Troubleshooting

#### 问题：切换语言后没有变化 / Issue: No change after switching language

**解决方案 / Solution:**
1. 确认已重启 VSCode/Cursor  
   Confirm VSCode/Cursor has been restarted

2. 检查 `locale.json` 文件格式是否正确  
   Check if `locale.json` format is correct

3. 重新安装扩展  
   Reinstall the extension

#### 问题：部分文本仍显示为其他语言 / Issue: Some text still shows in another language

**原因 / Reason:**  
日志输出可能混合使用中英文，这是正常的。主要面向用户的界面（菜单、消息）应该完全本地化。

Log output may mix Chinese and English, which is normal. User-facing interfaces (menus, messages) should be fully localized.

---

## 开发者文档 / Developer Documentation

### 技术实现 / Technical Implementation

#### 使用 VSCode NLS 机制 / Using VSCode NLS Mechanism

GitDiff BC 使用 VSCode 原生的 NLS（Native Language Support）机制实现国际化：

GitDiff BC uses VSCode's native NLS (Native Language Support) mechanism for internationalization:

```
package.nls.json         → 默认语言（英文） / Default language (English)
package.nls.zh-cn.json   → 中文语言包 / Chinese language pack
package.json             → 使用 %key% 引用 / Uses %key% references
```

#### 运行时国际化工具 / Runtime i18n Utility

创建了 `src/utils/i18n.ts` 模块：

- **自动语言检测**：基于 `vscode.env.language`
- **消息管理**：集中管理所有运行时消息
- **支持参数替换**：`t('message.key', arg1, arg2)`
- **类型安全**：使用 TypeScript 接口定义所有消息键

```typescript
import { t } from './utils/i18n';

// 使用示例 / Usage example
vscode.window.showInformationMessage(t('success.bcLaunched'));
throw new Error(t('error.notInGitRepo'));
```

### 文件结构 / File Structure

```
gitdiff-bc/
├── package.json              # 使用 %key% 格式引用国际化字符串
│                            # Uses %key% format to reference i18n strings
├── package.nls.json         # 英文语言包 (默认)
│                            # English language pack (default)
├── package.nls.zh-cn.json   # 简体中文语言包
│                            # Simplified Chinese language pack
└── src/
    ├── extension.ts         # 主扩展文件（已国际化）
    │                       # Main extension file (internationalized)
    ├── commands/
    │   ├── compareFile.ts   # 文件比较命令（已国际化）
    │   │                   # File comparison command (internationalized)
    │   └── compareFolder.ts # 文件夹比较命令（已国际化）
    │                       # Folder comparison command (internationalized)
    └── utils/
        └── i18n.ts          # 运行时国际化工具
                            # Runtime i18n utility
```

### 实现清单 / Implementation Checklist

#### ✅ 1. 语言包文件 / Language Pack Files

- **`package.nls.json`** (English - Default)
  - 扩展名称：GitDiff BC - Beyond Compare Git Diff Tool
  - 包含所有英文字符串定义

- **`package.nls.zh-cn.json`** (简体中文)
  - 扩展名称：GitDiff BC - Beyond Compare Git 对比工具
  - 包含所有中文字符串定义

#### ✅ 2. Package.json 国际化 / Package.json Internationalization

更新了 `package.json`，所有面向用户的文本都使用 `%key%` 格式：

```json
{
  "displayName": "%displayName%",
  "description": "%description%",
  "contributes": {
    "commands": [
      { "title": "%command.compareFileWithHead%" },
      { "title": "%command.compareFolderWithHead%" }
    ],
    "configuration": {
      "title": "%configuration.title%",
      "properties": {
        "beyondCompare.executablePath": {
          "markdownDescription": "%configuration.executablePath.description%"
        }
      }
    }
  }
}
```

#### ✅ 3. 源代码更新 / Source Code Updates

更新了以下文件以支持国际化：

1. **`src/extension.ts`**
   - 激活/停用消息
   - 命令注册消息
   - 配置更新消息

2. **`src/commands/compareFile.ts`**
   - 进度提示
   - 成功消息
   - 错误消息

3. **`src/commands/compareFolder.ts`**
   - 文件夹比较相关消息
   - 所有用户可见文本

#### 📊 国际化覆盖统计 / i18n Coverage Statistics

**Package.json:**
- ✅ 扩展名称：2 种语言
- ✅ 扩展描述：2 种语言
- ✅ 命令标题：4 个命令 × 2 种语言 = 8 条
- ✅ 配置描述：2 个配置项 × 2 种语言 = 4 条

**运行时消息 (src/utils/i18n.ts):**
- ✅ 扩展生命周期：8 条消息 × 2 种语言 = 16 条
- ✅ 命令执行：2 条消息 × 2 种语言 = 4 条
- ✅ 进度提示：6 条消息 × 2 种语言 = 12 条
- ✅ 成功消息：3 条消息 × 2 种语言 = 6 条
- ✅ 错误消息：5 条消息 × 2 种语言 = 10 条
- ✅ 配置消息：1 条消息 × 2 种语言 = 2 条

**总计：50 条国际化消息** 🎯

### 测试指南 / Testing Guide

#### 编译和打包 / Build and Package

```bash
# 编译 / Compile
npm run compile

# 打包 / Package
npm run package

# 结果 / Result
# dist/gitdiff-bc-0.1.0.vsix (73 files, 298.19 KB)
# ├── package.nls.json (1.03 KB)
# ├── package.nls.zh-cn.json (1.03 KB)
# └── out/utils/i18n.js
```

#### 测试步骤 / Test Steps

##### 测试 1：英文环境 / Test 1: English Environment

1. 打开 VSCode/Cursor 命令面板 (`Ctrl+Shift+P`)  
   Open VSCode/Cursor Command Palette (`Ctrl+Shift+P`)

2. 输入 `Configure Display Language`  
   Type `Configure Display Language`

3. 选择 `en` (English)  
   Select `en` (English)

4. 重启编辑器  
   Restart the editor

5. 安装扩展 / Install extension:  
   ```bash
   code --install-extension dist/gitdiff-bc-0.1.0.vsix --force
   ```

6. 验证 / Verify:
   - 扩展列表中显示 "GitDiff BC - Beyond Compare Git Diff Tool"
   - 右键菜单显示 "Compare File with Git HEAD"
   - 执行命令时进度提示显示英文 "Preparing comparison..."
   - 成功消息显示 "Beyond Compare launched"

##### 测试 2：中文环境 / Test 2: Chinese Environment

1. 打开 VSCode/Cursor 命令面板 (`Ctrl+Shift+P`)  
   Open VSCode/Cursor Command Palette (`Ctrl+Shift+P`)

2. 输入 `Configure Display Language`  
   Type `Configure Display Language`

3. 选择 `zh-cn` (简体中文)  
   Select `zh-cn` (Simplified Chinese)

4. 重启编辑器  
   Restart the editor

5. 安装扩展 / Install extension:  
   ```bash
   code --install-extension dist/gitdiff-bc-0.1.0.vsix --force
   ```

6. 验证 / Verify:
   - 扩展列表中显示 "GitDiff BC - Beyond Compare Git 对比工具"
   - 右键菜单显示 "与 Git HEAD 比较文件"
   - 执行命令时进度提示显示中文 "正在准备比较..."
   - 成功消息显示 "Beyond Compare 已启动"

##### 测试 3：配置页面 / Test 3: Configuration Page

1. 打开设置 (`Ctrl+,`)  
   Open Settings (`Ctrl+,`)

2. 搜索 "Beyond Compare"  
   Search "Beyond Compare"

3. 验证配置项描述根据语言正确显示  
   Verify configuration descriptions display correctly based on language

##### 测试 4：错误消息 / Test 4: Error Messages

1. 在非 Git 仓库中尝试比较文件  
   Try to compare a file in a non-Git repository

2. 验证错误消息正确显示：  
   Verify error messages display correctly:
   - 英文 / English: "Current file is not in a Git repository."
   - 中文 / Chinese: "当前文件不在 Git 仓库中。"

#### 验证清单 / Verification Checklist

- [ ] 扩展列表中名称正确显示  
      Extension name displays correctly in extension list
- [ ] 右键菜单命令文本正确  
      Context menu command text is correct
- [ ] 命令面板中命令标题正确  
      Command titles are correct in Command Palette
- [ ] 设置页面配置项描述正确  
      Configuration descriptions are correct in Settings
- [ ] 执行命令时进度提示正确  
      Progress messages are correct when executing commands
- [ ] 成功消息正确显示  
      Success messages display correctly
- [ ] 错误消息正确显示  
      Error messages display correctly

### 添加新语言 / Adding New Languages

如果你想为扩展添加其他语言支持，可以：  
If you want to add support for other languages:

#### 步骤 / Steps

1. **创建新的语言包文件 / Create a new language pack file:**
   ```
   package.nls.{locale}.json
   ```
   例如 / For example: `package.nls.ja.json` (Japanese), `package.nls.ko.json` (Korean)

2. **复制并翻译 / Copy and translate:**
   - 复制 `package.nls.json` 的内容  
     Copy content from `package.nls.json`
   - 翻译所有字符串值（保持键名不变）  
     Translate all string values (keep keys unchanged)

3. **更新 i18n.ts / Update i18n.ts:**
   ```typescript
   // 在 src/utils/i18n.ts 中添加新语言的消息定义
   // Add message definitions for the new language in src/utils/i18n.ts
   
   const ja: Messages = {
     'extension.activated': '拡張機能が有効化されました',
     // ... 其他消息 / ... other messages
   };
   
   function getMessages(): Messages {
     const locale = vscode.env.language.toLowerCase();
     if (locale.startsWith('zh')) {
       return zhCN;
     } else if (locale.startsWith('ja')) {
       return ja;
     }
     return en;
   }
   ```

4. **测试 / Test:**
   - 切换到新语言环境  
     Switch to the new language environment
   - 验证所有文本正确显示  
     Verify all text displays correctly

5. **提交 Pull Request!**  
   Submit a Pull Request!

---

## 🎯 最佳实践 / Best Practices

### ✅ 我们遵循的最佳实践 / Best Practices We Follow

1. **使用 VSCode 原生机制 / Use VSCode Native Mechanism**
   - 不引入额外的 i18n 库  
     No additional i18n libraries required
   - 充分利用 VSCode 的 NLS 支持  
     Fully leverage VSCode's NLS support

2. **分离静态和动态文本 / Separate Static and Dynamic Text**
   - `package.nls.json`：静态文本（命令、配置）  
     Static text (commands, configurations)
   - `src/utils/i18n.ts`：动态文本（运行时消息）  
     Dynamic text (runtime messages)

3. **保持键名语义化 / Keep Keys Semantic**
   - `command.compareFileWithHead`
   - `error.notInGitRepo`
   - `progress.checkingRepo`

4. **日志使用英文 / Logs in English**
   - 便于技术支持和问题诊断  
     Easier for technical support and debugging
   - 只有面向用户的消息才国际化  
     Only user-facing messages are internationalized

5. **完善的文档 / Comprehensive Documentation**
   - 提供详细的使用说明  
     Provide detailed usage instructions
   - 中英文对照文档  
     Bilingual documentation

---

## 📚 相关资源 / Related Resources

- [VSCode 扩展国际化文档 / VSCode Extension i18n Documentation](https://code.visualstudio.com/api/references/extension-manifest#_localization)
- [VSCode 支持的语言列表 / VSCode Supported Languages](https://code.visualstudio.com/docs/getstarted/locales)

---

## ✨ 总结 / Summary

**中文总结：**  
成功为 GitDiff BC 扩展实现了完整的国际化支持，包括中英文界面。扩展会根据 VSCode 的语言设置自动切换显示语言，为不同语言的用户提供原生的使用体验。实现过程遵循 VSCode 最佳实践，代码结构清晰，易于维护和扩展。

**English Summary:**  
Successfully implemented comprehensive internationalization support for the GitDiff BC extension, including both Chinese and English interfaces. The extension automatically switches display language based on VSCode's language settings, providing native experience for users of different languages. The implementation follows VSCode best practices with clear code structure, easy to maintain and extend.

---

**Enjoy using GitDiff BC in your preferred language!** 🌍✨  
**使用您喜欢的语言享受 GitDiff BC！** 🌍✨

**当前版本 / Current Version:** 0.1.0  
**实现日期 / Implementation Date:** 2025-11-22
