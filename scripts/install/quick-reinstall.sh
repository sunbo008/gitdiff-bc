#!/bin/bash

# Beyond Compare Git 扩展快速重新安装脚本
# 位置: scripts/install/quick-reinstall.sh

echo "================================================"
echo "Beyond Compare Git 扩展快速重新安装"
echo "================================================"
echo ""

# 检测操作系统
detect_os() {
    case "$(uname -s)" in
        MINGW*|MSYS*|CYGWIN*)
            echo "windows"
            ;;
        Darwin*)
            echo "macos"
            ;;
        Linux*)
            echo "linux"
            ;;
        *)
            echo "unknown"
            ;;
    esac
}

OS_TYPE=$(detect_os)
echo "🖥️  操作系统: $OS_TYPE"
echo ""

# 1. 卸载
echo "📦 [1/5] 卸载旧版本..."
cursor --uninstall-extension your-publisher-name.gitdiff-bc 2>/dev/null || true
echo "✅ 完成"
echo ""

# 2. 清理
echo "🧹 [2/5] 清理缓存..."
if [ "$OS_TYPE" = "windows" ]; then
    # Windows 路径
    rm -rf "$USERPROFILE/.cursor/extensions/your-publisher-name.gitdiff-bc-"* 2>/dev/null || true
else
    # macOS/Linux 路径
    rm -rf ~/.cursor/extensions/your-publisher-name.gitdiff-bc-* 2>/dev/null || true
fi
echo "✅ 完成"
echo ""

# 3. 退出 Cursor
echo "🚪 [3/5] 退出 Cursor..."
if [ "$OS_TYPE" = "windows" ]; then
    # Windows: 使用 taskkill
    taskkill //F //IM Cursor.exe 2>/dev/null || true
elif [ "$OS_TYPE" = "macos" ]; then
    # macOS: 使用 killall
    killall Cursor 2>/dev/null || true
else
    # Linux: 尝试多种方式
    pkill -9 cursor 2>/dev/null || killall -9 cursor 2>/dev/null || true
fi
echo "⏳ 等待 5 秒..."
sleep 5
echo "✅ 完成"
echo ""

# 4. 安装
echo "📥 [4/5] 安装新版本..."

# 获取脚本所在目录的上两级目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"
echo "📂 项目目录: $PROJECT_ROOT"

# 查找 VSIX 文件
VSIX_FILE=$(ls dist/gitdiff-bc-*.vsix 2>/dev/null | head -n 1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ 错误：找不到 VSIX 文件"
    echo "   请先运行: npm run package"
    exit 1
fi

echo "📦 找到安装包: $VSIX_FILE"
cursor --install-extension "$VSIX_FILE"
echo "✅ 完成"
echo ""

# 5. 重启
echo "🔄 [5/5] 完全重启 Cursor..."
if [ "$OS_TYPE" = "windows" ]; then
    # Windows: 关闭并启动
    taskkill //F //IM Cursor.exe 2>/dev/null || true
    sleep 3
    start "" "Cursor" 2>/dev/null || cmd //c start Cursor 2>/dev/null || echo "⚠️  请手动启动 Cursor"
elif [ "$OS_TYPE" = "macos" ]; then
    # macOS: 使用 open 命令
    killall Cursor 2>/dev/null || true
    sleep 3
    open -a Cursor
else
    # Linux: 尝试多种方式
    pkill -9 cursor 2>/dev/null || killall -9 cursor 2>/dev/null || true
    sleep 3
    (cursor >/dev/null 2>&1 &) || echo "⚠️  请手动启动 Cursor"
fi
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
if [ "$OS_TYPE" = "macos" ]; then
    echo "   - 按 Cmd+Shift+P"
else
    echo "   - 按 Ctrl+Shift+P"
fi
echo "   - 输入 'Developer: Show Running Extensions'"
echo "   - 找到 'gitdiff-bc'"
echo "   - 状态应该显示 '✅ Activated'（不是 activating...）"
echo ""
echo "3. 📄 查看日志："
if [ "$OS_TYPE" = "macos" ]; then
    echo "   - 按 Cmd+Shift+U 打开输出面板"
else
    echo "   - 按 Ctrl+Shift+U 打开输出面板"
fi
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


