// 测试路径解析器的改进

const testCases = [
  // 应该被识别为代码，而非文件路径
  {
    input: "await vscode.commands.executeCommand('workbench.action.terminal.copySelection');",
    shouldBeFiltered: true,
    reason: "包含 await 关键字、函数调用、引号"
  },
  {
    input: "const result = someFunction();",
    shouldBeFiltered: true,
    reason: "包含 const 关键字和函数调用"
  },
  {
    input: "vscode.window.showErrorMessage('error');",
    shouldBeFiltered: true,
    reason: "包含多级点号调用和引号"
  },
  
  // 应该被识别为文件路径
  {
    input: "src/commands/compareFileFromTerminal.ts",
    shouldBeFiltered: false,
    reason: "Unix风格的文件路径"
  },
  {
    input: "src\\commands\\compareFileFromTerminal.ts",
    shouldBeFiltered: false,
    reason: "Windows风格的文件路径"
  },
  {
    input: "modified:   src/utils/terminalPathParser.ts",
    shouldBeFiltered: false,
    reason: "git status 输出"
  },
  {
    input: "D:\\workspace\\gitdiff-bc\\README.md",
    shouldBeFiltered: false,
    reason: "Windows绝对路径"
  }
];

console.log("路径解析测试用例：");
testCases.forEach((testCase, index) => {
  console.log(`\n测试 ${index + 1}: ${testCase.shouldBeFiltered ? '❌ 应过滤' : '✓ 应识别'}`);
  console.log(`  输入: "${testCase.input}"`);
  console.log(`  原因: ${testCase.reason}`);
});


