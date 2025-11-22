# 改进文件夹比较的错误提示友好性

## Why

当用户尝试比较一个未入库的文件夹（即未纳入 Git 版本控制的文件夹）时，扩展会显示包含大量技术细节的错误信息：

```
比较文件夹失败: 导出 Git HEAD 版本失败: Command failed: git archive HEAD -- "openspec/changes/archive/2025-11-22-add-workspace-root-compare" | tar -x -C "/c/Users/sunbo/AppData/Local/Temp/gitdiff-bc/folder-folder-compare-1763826392864" 
fatal: pathspec 'openspec/changes/archive/2025-11-22-add-workspace-root-compare' did not match any files 
tar: This does not look like a tar archive 
tar: Exiting with failure status due to previous errors
```

这对普通用户来说非常不友好，他们无法快速理解问题的本质。用户需要简洁明确的错误信息来快速理解并解决问题。

## What Changes

在执行 `git archive` 导出 HEAD 版本之前，先使用 `git ls-tree -d HEAD` 检查文件夹是否存在于 Git HEAD 中：

1. 对于根目录比较：跳过检查（根目录总是存在）
2. 对于子文件夹比较：先检查文件夹是否在 Git 中
   - 如果不在：显示友好的错误信息："文件夹未纳入 Git 版本控制，无法比较。请先提交该文件夹。"
   - 如果在：继续正常的比较流程

### 影响的文件

- `src/commands/compareFolder.ts`: 在步骤 3 添加文件夹存在性检查逻辑

### 用户体验影响

- **正面**: 大幅提升用户体验，用户能立即理解问题所在
- **性能**: 额外一次 `git ls-tree` 调用（非常快速，几乎无影响）
- **兼容性**: 不影响现有功能，仅改进错误提示


