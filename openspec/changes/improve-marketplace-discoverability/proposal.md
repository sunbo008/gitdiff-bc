# Change: 改进扩展市场可发现性

## Why

当前扩展在 Cursor 扩展商店中搜索 "gitdiff" 时无法找到，但在 VSCode 扩展商店中能够找到。问题的根源在于：

1. **关键词缺失**：关键词列表中缺少 "gitdiff"、"gitdiff-bc" 等核心搜索词
2. **分类不精确**：使用 "Other" 分类而非更精确的 "SCM Providers" 
3. **搜索匹配度低**：现有关键词（"beyond compare", "git", "diff" 等）在组合搜索时匹配度不高

这导致用户在 Cursor 中使用自然搜索词时无法找到扩展，影响了扩展的可发现性和用户体验。

## What Changes

- 优化 `package.json` 中的 `categories` 字段，添加 "SCM Providers" 分类
- 扩充 `keywords` 列表，添加更多相关搜索词：
  - 直接关键词：gitdiff, gitdiff-bc, bc, beyond-compare
  - 功能描述词：git diff, file compare, folder compare, version control
- 保持现有关键词不变，避免影响已有的搜索匹配

## Impact

- **受影响的 specs**: beyondcompare-integration
- **受影响的代码**: 
  - `package.json` (categories, keywords)
- **用户影响**: 提升在 Cursor 扩展商店的搜索可发现性
- **向后兼容性**: ✅ 完全兼容，仅为元数据优化

