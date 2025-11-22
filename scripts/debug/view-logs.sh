#!/bin/bash

# Beyond Compare Git 扩展日志查看脚本
# 位置: scripts/debug/view-logs.sh

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

# 根据操作系统设置日志目录
if [ "$OS_TYPE" = "windows" ]; then
    # Windows: 使用 TEMP 环境变量
    LOG_DIR="${TEMP:-/tmp}/gitdiff-bc-logs"
else
    # macOS/Linux: 优先使用 TMPDIR，否则使用 /tmp
    LOG_DIR="${TMPDIR:-/tmp}/gitdiff-bc-logs"
fi

echo "================================================"
echo "Beyond Compare Git 扩展日志查看器"
echo "================================================"
echo ""
echo "🖥️  操作系统: $OS_TYPE"

# 检查日志目录
if [ ! -d "$LOG_DIR" ]; then
    echo "❌ 日志目录不存在: $LOG_DIR"
    echo ""
    echo "可能原因："
    echo "  1. 扩展从未运行过"
    echo "  2. 扩展激活失败"
    echo ""
    echo "尝试以下步骤："
    echo "  1. 打开 Cursor"
    if [ "$OS_TYPE" = "macos" ]; then
        echo "  2. 按 Cmd+Shift+P"
    else
        echo "  2. 按 Ctrl+Shift+P"
    fi
    echo "  3. 输入 'Developer: Show Running Extensions'"
    echo "  4. 查找 'gitdiff-bc' 是否在运行"
    exit 1
fi

echo "📂 日志目录: $LOG_DIR"
echo ""

# 列出所有日志文件
LOG_FILES=$(ls -t "$LOG_DIR"/*.log 2>/dev/null)

if [ -z "$LOG_FILES" ]; then
    echo "❌ 没有找到日志文件"
    echo ""
    echo "这意味着扩展可能没有被激活。"
    echo ""
    echo "请检查："
    echo "  1. 扩展是否已安装: cursor --list-extensions | grep gitdiff-bc"
    if [ "$OS_TYPE" = "macos" ]; then
        echo "  2. 扩展是否已激活: 在 Cursor 中按 Cmd+Shift+P -> 'Developer: Show Running Extensions'"
    else
        echo "  2. 扩展是否已激活: 在 Cursor 中按 Ctrl+Shift+P -> 'Developer: Show Running Extensions'"
    fi
    echo "  3. 查看浏览器控制台: Help -> Toggle Developer Tools"
    exit 1
fi

echo "📋 找到以下日志文件:"
echo ""

COUNT=0
declare -a FILES_ARRAY

while IFS= read -r file; do
    COUNT=$((COUNT + 1))
    FILES_ARRAY+=("$file")
    FILENAME=$(basename "$file")
    
    # 跨平台获取文件大小和修改时间
    if [ "$OS_TYPE" = "macos" ]; then
        SIZE=$(ls -lh "$file" | awk '{print $5}')
        MTIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file")
    elif [ "$OS_TYPE" = "windows" ]; then
        SIZE=$(du -h "$file" | cut -f1)
        MTIME=$(date -r "$file" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "N/A")
    else
        # Linux
        SIZE=$(ls -lh "$file" | awk '{print $5}')
        MTIME=$(stat -c "%y" "$file" | cut -d'.' -f1)
    fi
    
    echo "  [$COUNT] $FILENAME"
    echo "      大小: $SIZE | 修改时间: $MTIME"
done <<< "$LOG_FILES"

echo ""

# 如果只有一个文件，直接显示
if [ $COUNT -eq 1 ]; then
    echo "================================================"
    echo "最新日志内容:"
    echo "================================================"
    echo ""
    cat "${FILES_ARRAY[0]}"
    echo ""
    echo "================================================"
    echo "日志文件路径: ${FILES_ARRAY[0]}"
    echo ""
echo "命令:"
echo "  查看实时日志: tail -f \"${FILES_ARRAY[0]}\""
if [ "$OS_TYPE" = "macos" ]; then
    echo "  打开目录: open \"$LOG_DIR\""
elif [ "$OS_TYPE" = "windows" ]; then
    echo "  打开目录: explorer \"$LOG_DIR\""
else
    echo "  打开目录: xdg-open \"$LOG_DIR\" 或 nautilus \"$LOG_DIR\""
fi
echo "================================================"
    exit 0
fi

# 多个文件时显示最新的
LATEST="${FILES_ARRAY[0]}"
echo "================================================"
echo "最新日志内容: $(basename "$LATEST")"
echo "================================================"
echo ""
cat "$LATEST"
echo ""
echo "================================================"
echo "日志文件路径: $LATEST"
echo ""
echo "命令:"
echo "  查看实时日志: tail -f \"$LATEST\""
if [ "$OS_TYPE" = "macos" ]; then
    echo "  打开目录: open \"$LOG_DIR\""
elif [ "$OS_TYPE" = "windows" ]; then
    echo "  打开目录: explorer \"$LOG_DIR\""
else
    echo "  打开目录: xdg-open \"$LOG_DIR\" 或 nautilus \"$LOG_DIR\""
fi
echo "  查看所有日志: ls -lht \"$LOG_DIR\""
echo "================================================"


