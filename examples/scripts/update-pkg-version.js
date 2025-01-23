import shelljs from 'shelljs';
import semver from 'semver';
import url from 'node:url';
import fs from 'node:fs';
import { dirname, resolve } from 'node:path';

let newVersion = process.argv[2] ? process.argv[2].replace(/^v/, '') : '';

const packageName = '@dope-js/markdown-editor';

const getVersions = (packageName) => {
  const str = shelljs
    .exec(`npm view ${packageName} versions --json`, { silent: true })
    .stdout.trim()
    .replace(/\s+/g, '')
    .replace(
      /\\u2006|\\u00a0|\\u0020|\\u0008|\\u0009|\\u000a|\\u000b|\\u000c|\\u000d|\\u2028|\\u2029|\\ufeff|\\u200e|\\u200d|\\u3000/g,
      ''
    );

  if (str) {
    const obj = JSON.parse(str);
    if (Array.isArray(obj) && obj.length > 0) {
      const sortedVersionList = obj.sort(semver.rcompare);
      return new Set(sortedVersionList);
    }
  }

  throw new Error('get versions failed');
};

const findLatestVersion = (versionSet) => {
  return [...versionSet].find((v) => v === semver.coerce(v).raw);
};

if (!newVersion) {
  const versionSet = getVersions(packageName);
  const latestVersion = findLatestVersion(versionSet);

  newVersion = latestVersion;
}

if (!newVersion) {
  throw new Error('new version is empty');
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const pkgPath = resolve(dirname(__dirname), 'package.json');

const packageJsonContent = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));

function replaceVersion(dependencies) {
  if (typeof dependencies !== 'object' || dependencies === null) {
    return;
  }

  for (const [pkgName, pkgVersion] of Object.entries(dependencies)) {
    if (pkgName === packageName) {
      dependencies[pkgName] = newVersion;
    }
  }
}

replaceVersion(packageJsonContent.dependencies);
replaceVersion(packageJsonContent.devDependencies);
replaceVersion(packageJsonContent.peerDependencies);
replaceVersion(packageJsonContent.optionalDependencies);

await fs.promises.writeFile(pkgPath, JSON.stringify(packageJsonContent, undefined, 2), 'utf-8');
