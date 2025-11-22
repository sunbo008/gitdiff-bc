#!/bin/bash

# Beyond Compare Git 扩展日志查看脚本
# 位置: scripts/debug/view-logs.sh

LOG_DIR="$TMPDIR/gitdiff-bc-logs"
if [ ! -d "$LOG_DIR" ]; then
    LOG_DIR="/tmp/gitdiff-bc-logs"
fi

echo "================================================"
echo "Beyond Compare Git 扩展日志查看器"
echo "================================================"
echo ""

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
    echo "  2. 按 Cmd+Shift+P"
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
    echo "  2. 扩展是否已激活: 在 Cursor 中按 Cmd+Shift+P -> 'Developer: Show Running Extensions'"
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
    SIZE=$(ls -lh "$file" | awk '{print $5}')
    MTIME=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$file")
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
    echo "  打开目录: open \"$LOG_DIR\""
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
echo "  打开目录: open \"$LOG_DIR\""
echo "  查看所有日志: ls -lht \"$LOG_DIR\""
echo "================================================"


