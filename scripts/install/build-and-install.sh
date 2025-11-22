#!/bin/bash

# Beyond Compare Git 扩展构建并安装脚本
# 位置: scripts/install/build-and-install.sh

echo "================================================"
echo "Beyond Compare Git 扩展构建并安装"
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

# 获取项目根目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$PROJECT_ROOT"
echo "📂 项目目录: $PROJECT_ROOT"
echo ""

# 1. 检查并安装依赖
echo "🔍 [1/8] 检查依赖..."

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "⚠️  未找到 node_modules 目录"
    echo "📦 正在安装项目依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo "✅ 依赖安装完成"
else
    # 检查关键依赖包是否存在
    MISSING_DEPS=0
    
    if [ ! -d "node_modules/@types/node" ]; then
        echo "⚠️  缺少 @types/node"
        MISSING_DEPS=1
    fi
    
    if [ ! -d "node_modules/@types/vscode" ]; then
        echo "⚠️  缺少 @types/vscode"
        MISSING_DEPS=1
    fi
    
    if [ ! -d "node_modules/typescript" ]; then
        echo "⚠️  缺少 typescript"
        MISSING_DEPS=1
    fi
    
    if [ $MISSING_DEPS -eq 1 ]; then
        echo "📦 正在安装缺失的依赖..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ 依赖安装失败"
            exit 1
        fi
        echo "✅ 依赖安装完成"
    else
        echo "✅ 项目依赖已就绪"
    fi
fi
echo ""

# 2. 检查并安装全局工具
echo "🔧 [2/8] 检查全局工具..."

# 检查 vsce
if ! command -v vsce &> /dev/null; then
    echo "⚠️  未找到 vsce 命令"
    echo "📦 正在安装 @vscode/vsce..."
    npm install -g @vscode/vsce
    if [ $? -ne 0 ]; then
        echo "❌ vsce 安装失败"
        exit 1
    fi
    echo "✅ vsce 安装完成"
else
    echo "✅ vsce 已安装 ($(vsce --version))"
fi

# 检查 tsc
if ! command -v tsc &> /dev/null; then
    echo "⚠️  未找到 tsc 命令"
    echo "📦 正在安装 typescript..."
    npm install -g typescript
    if [ $? -ne 0 ]; then
        echo "❌ typescript 安装失败"
        exit 1
    fi
    echo "✅ typescript 安装完成"
else
    echo "✅ tsc 已安装 ($(tsc --version))"
fi
echo ""

# 3. 构建
echo "🔨 [3/8] 编译和打包..."
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

# 4. 卸载所有旧版本
echo "📦 [4/8] 卸载所有旧版本..."

# 获取所有已安装的 gitdiff-bc 扩展
INSTALLED_EXTENSIONS=$(cursor --list-extensions 2>/dev/null | grep -i "gitdiff-bc" || true)

if [ -n "$INSTALLED_EXTENSIONS" ]; then
    echo "⚠️  发现已安装的版本："
    echo "$INSTALLED_EXTENSIONS"
    
    # 卸载每一个找到的版本
    while IFS= read -r ext; do
        if [ -n "$ext" ]; then
            echo "   卸载: $ext"
            cursor --uninstall-extension "$ext" 2>/dev/null || true
        fi
    done <<< "$INSTALLED_EXTENSIONS"
else
    echo "   未发现已安装的版本"
fi

echo "✅ 完成"
echo ""

# 5. 清理所有缓存
echo "🧹 [5/8] 清理所有缓存..."
if [ "$OS_TYPE" = "windows" ]; then
    # Windows 路径 - 清理所有可能的发布者名称
    rm -rf "$USERPROFILE/.cursor/extensions/"*".gitdiff-bc-"* 2>/dev/null || true
else
    # macOS/Linux 路径 - 清理所有可能的发布者名称
    rm -rf ~/.cursor/extensions/*.gitdiff-bc-* 2>/dev/null || true
fi
echo "✅ 完成"
echo ""

# 6. 退出 Cursor
echo "🚪 [6/8] 退出 Cursor..."
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

# 7. 安装
echo "📥 [7/8] 安装新版本..."
cursor --install-extension "$VSIX_FILE"
echo "✅ 完成"
echo ""

# 8. 重启
echo "🔄 [8/8] 完全重启 Cursor..."
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


