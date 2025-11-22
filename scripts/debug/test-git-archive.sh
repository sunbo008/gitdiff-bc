#!/bin/bash

# Git Archive 功能测试脚本
# 位置: scripts/debug/test-git-archive.sh

echo "================================================"
echo "Git Archive 测试脚本"
echo "================================================"
echo ""

# 检查是否在 Git 仓库中
if [ ! -d ".git" ]; then
    echo "❌ 错误：当前目录不是 Git 仓库"
    echo "请在 Git 仓库目录中运行此脚本"
    exit 1
fi

echo "✅ 当前目录是 Git 仓库"
echo ""

# 获取仓库信息
REPO_ROOT=$(git rev-parse --show-toplevel)
echo "📁 仓库根目录: $REPO_ROOT"
echo ""

# 测试导出整个仓库
echo "🧪 测试 1: 导出整个仓库"
TEMP_DIR="/tmp/git-archive-test-full-$$"
mkdir -p "$TEMP_DIR"

if git archive HEAD | tar -x -C "$TEMP_DIR" 2>&1; then
    FILE_COUNT=$(find "$TEMP_DIR" -type f | wc -l)
    echo "✅ 成功: 导出了 $FILE_COUNT 个文件"
    ls -la "$TEMP_DIR" | head -10
    rm -rf "$TEMP_DIR"
else
    echo "❌ 失败: 无法导出仓库"
    rm -rf "$TEMP_DIR"
fi
echo ""

# 测试导出特定文件夹
echo "🧪 测试 2: 导出 cxx 文件夹"
TEMP_DIR2="/tmp/git-archive-test-cxx-$$"
mkdir -p "$TEMP_DIR2"

if git archive HEAD -- "cxx" | tar -x -C "$TEMP_DIR2" 2>&1; then
    echo "✅ 命令执行成功"
    echo "临时目录内容:"
    ls -la "$TEMP_DIR2"
    
    if [ -d "$TEMP_DIR2/cxx" ]; then
        FILE_COUNT=$(find "$TEMP_DIR2/cxx" -type f | wc -l)
        echo "✅ cxx 文件夹存在，包含 $FILE_COUNT 个文件"
        echo "文件列表:"
        ls -la "$TEMP_DIR2/cxx" | head -10
    else
        echo "⚠️  cxx 文件夹不在临时目录中"
        echo "实际内容:"
        find "$TEMP_DIR2" -type f | head -10
    fi
    
    rm -rf "$TEMP_DIR2"
else
    echo "❌ 失败: 无法导出 cxx 文件夹"
    rm -rf "$TEMP_DIR2"
fi
echo ""

# 测试导出 docs 文件夹
echo "🧪 测试 3: 导出 docs 文件夹"
TEMP_DIR3="/tmp/git-archive-test-docs-$$"
mkdir -p "$TEMP_DIR3"

if git archive HEAD -- "docs" | tar -x -C "$TEMP_DIR3" 2>&1; then
    echo "✅ 命令执行成功"
    echo "临时目录内容:"
    ls -la "$TEMP_DIR3"
    
    if [ -d "$TEMP_DIR3/docs" ]; then
        FILE_COUNT=$(find "$TEMP_DIR3/docs" -type f | wc -l)
        echo "✅ docs 文件夹存在，包含 $FILE_COUNT 个文件"
        echo "文件列表:"
        ls -la "$TEMP_DIR3/docs" | head -10
    else
        echo "⚠️  docs 文件夹不在临时目录中"
        echo "实际内容:"
        find "$TEMP_DIR3" -type f | head -10
    fi
    
    rm -rf "$TEMP_DIR3"
else
    echo "❌ 失败: 无法导出 docs 文件夹"
    rm -rf "$TEMP_DIR3"
fi
echo ""

echo "================================================"
echo "测试完成"
echo "================================================"


