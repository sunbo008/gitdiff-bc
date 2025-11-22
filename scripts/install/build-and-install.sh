#!/bin/bash

# Beyond Compare Git 扩展构建并安装脚本
# 位置: scripts/install/build-and-install.sh

echo "================================================"
echo "Beyond Compare Git 扩展构建并安装"
echo "================================================"
echo ""

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"
echo "📂 项目目录: $PROJECT_ROOT"
echo ""

# 1. 构建
echo "🔨 [1/6] 编译和打包..."
npm run package

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 检查 VSIX 文件
VSIX_FILE=$(ls dist/gitdiff-bc-*.vsix 2>/dev/null | head -n 1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ 错误：找不到 VSIX 文件"
    exit 1
fi

echo "✅ 完成 - 生成: $VSIX_FILE"
echo ""

# 2. 卸载
echo "📦 [2/6] 卸载旧版本..."
cursor --uninstall-extension your-publisher-name.gitdiff-bc 2>/dev/null || true
echo "✅ 完成"
echo ""

# 3. 清理
echo "🧹 [3/6] 清理缓存..."
rm -rf ~/.cursor/extensions/your-publisher-name.gitdiff-bc-* 2>/dev/null || true
echo "✅ 完成"
echo ""

# 4. 退出 Cursor
echo "🚪 [4/6] 退出 Cursor..."
killall Cursor 2>/dev/null || true
echo "⏳ 等待 5 秒..."
sleep 5
echo "✅ 完成"
echo ""

# 5. 安装
echo "📥 [5/6] 安装新版本..."
cursor --install-extension "$VSIX_FILE"
echo "✅ 完成"
echo ""

# 6. 重启
echo "🔄 [6/6] 完全重启 Cursor..."
killall Cursor 2>/dev/null || true
sleep 3
open -a Cursor
echo "✅ 完成"
echo ""

echo "================================================"
echo "✨ 安装完成！"
echo "================================================"
echo ""
echo "📋 接下来的步骤："
echo ""
echo "1. ⏰ 等待 Cursor 完全启动（约 5-10 秒）"
echo ""
echo "2. 🔍 验证扩展激活："
echo "   - 按 Cmd+Shift+P"
echo "   - 输入 'Developer: Show Running Extensions'"
echo "   - 找到 'gitdiff-bc'"
echo "   - 状态应该显示 '✅ Activated'（不是 activating...）"
echo ""
echo "3. 📄 查看日志："
echo "   - 按 Cmd+Shift+U 打开输出面板"
echo "   - 选择 'Beyond Compare Git'"
echo "   - 应该看到激活成功的日志"
echo ""
echo "4. 🧪 测试功能："
echo "   - 打开 Git 仓库"
echo "   - 右键点击文件"
echo "   - 选择 'Compare File with Git HEAD'"
echo ""
echo "如果还有问题，运行查看日志："
echo "  ./scripts/debug/view-logs.sh"
echo ""
echo "================================================"


