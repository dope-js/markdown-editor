const path = require('path');
const fs = require('fs');
const newVersion = process.argv[2].replace(/^v/, ''); // 获取命令行参数中的新版本号,并过滤v字头

if (!newVersion) {
  console.log('New version missed.');
  process.exit(1);
}

const currentDirectory = process.cwd();

const packageJsonPath = path.join(currentDirectory, 'package.json');
const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
const packageJson = JSON.parse(packageJsonContent);
const currentVersion = packageJson.version;

packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(`The version is changed from ${currentVersion} to ${newVersion}`);
