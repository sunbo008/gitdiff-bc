#!/usr/bin/env node

/**
 * 发布前检查脚本
 * 在发布到 VSCode Marketplace 前运行各项检查
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REQUIRED_FILES = [
  'package.json',
  'README.md',
  'CHANGELOG.md',
  'icon.png'
];

const LICENSE_FILES = ['LICENSE', 'LICENSE.txt', 'LICENSE.md'];

let hasErrors = false;

console.log('🔍 开始发布前检查...\n');

// 1. 检查必需文件
console.log('1️⃣ 检查必需文件...');
for (const file of REQUIRED_FILES) {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - 文件缺失！`);
    hasErrors = true;
  }
}

// 检查 LICENSE 文件（支持多种命名）
const licenseFile = LICENSE_FILES.find(f => fs.existsSync(path.join(ROOT, f)));
if (licenseFile) {
  console.log(`   ✅ ${licenseFile}`);
} else {
  console.log(`   ❌ LICENSE - 文件缺失！`);
  hasErrors = true;
}

// 2. 检查 package.json
console.log('\n2️⃣ 检查 package.json 配置...');
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

const requiredFields = ['name', 'displayName', 'description', 'version', 'publisher', 'icon', 'engines'];
for (const field of requiredFields) {
  if (pkg[field]) {
    console.log(`   ✅ ${field}: ${typeof pkg[field] === 'object' ? JSON.stringify(pkg[field]) : pkg[field]}`);
  } else {
    console.log(`   ❌ ${field} - 字段缺失！`);
    hasErrors = true;
  }
}

// 3. 检查版本号格式
console.log('\n3️⃣ 检查版本号...');
const versionRegex = /^\d+\.\d+\.\d+$/;
if (versionRegex.test(pkg.version)) {
  console.log(`   ✅ 版本号格式正确: ${pkg.version}`);
} else {
  console.log(`   ❌ 版本号格式错误: ${pkg.version}`);
  hasErrors = true;
}

// 4. 检查 CHANGELOG
console.log('\n4️⃣ 检查 CHANGELOG.md...');
const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
if (changelog.includes(pkg.version)) {
  console.log(`   ✅ CHANGELOG 包含当前版本 ${pkg.version}`);
} else {
  console.log(`   ⚠️  CHANGELOG 未包含当前版本 ${pkg.version}，建议更新`);
}

// 5. 检查 README
console.log('\n5️⃣ 检查 README.md...');
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf8');
if (readme.length > 100) {
  console.log(`   ✅ README 内容充足 (${readme.length} 字符)`);
} else {
  console.log(`   ⚠️  README 内容较少 (${readme.length} 字符)，建议完善`);
}

// 6. 检查图标
console.log('\n6️⃣ 检查图标文件...');
const iconPath = path.join(ROOT, pkg.icon || 'icon.png');
if (fs.existsSync(iconPath)) {
  const stats = fs.statSync(iconPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   ✅ 图标存在 (${sizeKB} KB)`);
  
  // VSCode 建议图标大小为 128x128 像素
  if (stats.size > 1024 * 1024) {
    console.log(`   ⚠️  图标文件过大 (${sizeKB} KB)，建议压缩到 < 1MB`);
  }
} else {
  console.log(`   ❌ 图标文件不存在: ${pkg.icon}`);
  hasErrors = true;
}

// 7. 检查编译输出
console.log('\n7️⃣ 检查编译输出...');
const outDir = path.join(ROOT, 'out');
if (fs.existsSync(outDir)) {
  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.js'));
  if (files.length > 0) {
    console.log(`   ✅ 编译输出存在 (${files.length} 个 JS 文件)`);
  } else {
    console.log(`   ❌ 编译输出为空，请运行 npm run compile`);
    hasErrors = true;
  }
} else {
  console.log(`   ❌ 编译输出目录不存在，请运行 npm run compile`);
  hasErrors = true;
}

// 8. 检查 .vscodeignore
console.log('\n8️⃣ 检查 .vscodeignore...');
const vscodeignorePath = path.join(ROOT, '.vscodeignore');
if (fs.existsSync(vscodeignorePath)) {
  console.log(`   ✅ .vscodeignore 存在`);
  const content = fs.readFileSync(vscodeignorePath, 'utf8');
  const recommended = ['src/', '.vscode/', 'node_modules/', '.git/', 'tsconfig.json'];
  const missing = recommended.filter(item => !content.includes(item));
  if (missing.length > 0) {
    console.log(`   ⚠️  建议添加到 .vscodeignore: ${missing.join(', ')}`);
  }
} else {
  console.log(`   ⚠️  .vscodeignore 不存在，建议创建以减小打包体积`);
}

// 总结
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ 检查失败！请修复上述错误后再发布。');
  process.exit(1);
} else {
  console.log('✅ 所有检查通过！可以安全发布。');
  console.log('\n📦 运行以下命令发布：');
  console.log('   npm run publish:patch  # 补丁版本 (bug 修复)');
  console.log('   npm run publish:minor  # 次版本 (新功能)');
  console.log('   npm run publish:major  # 主版本 (破坏性更改)');
  process.exit(0);
}

