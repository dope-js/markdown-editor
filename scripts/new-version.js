const semver = require('semver');
const shell = require('shelljs');

const package = '@dope-js/markdown-editor';

const getVersions = () => {
  const str = shell
    .exec(`npm view ${package} versions --json`, { silent: true })
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

const getMajorVersion = (versionSet) => {
  const latestVersion = findLatestVersion(versionSet, 'latest');
  const nextVersion = semver.inc(latestVersion, 'major');
  return nextVersion;
};

const getMinorVersion = (versionSet) => {
  const latestVersion = findLatestVersion(versionSet, 'latest');
  const nextVersion = semver.inc(latestVersion, 'minor');
  return nextVersion;
};

const getPatchVersion = (versionSet) => {
  const latestVersion = findLatestVersion(versionSet, 'latest');
  const nextVersion = semver.inc(latestVersion, 'patch');
  return nextVersion;
};

const getBetaVersion = (versionSet) => {
  const latestVersion = findLatestVersion(versionSet);
  let nextVersion = semver.inc(latestVersion, 'prepatch', 'beta');
  while (versionSet.has(nextVersion)) {
    nextVersion = semver.inc(nextVersion, 'prerelease', 'beta');
  }
  return nextVersion;
};

const getAlphaVersion = (versionSet) => {
  const latestVersion = findLatestVersion(versionSet);
  let nextVersion = semver.inc(latestVersion, 'preminor', 'alpha');
  while (versionSet.has(nextVersion)) {
    nextVersion = semver.inc(nextVersion, 'prerelease', 'alpha');
  }
  return nextVersion;
};

const getNextVersion = (versionSet) => {
  const latestVersion = findLatestVersion(versionSet);
  let nextVersion = semver.inc(latestVersion, 'premajor', 'next');
  while (versionSet.has(nextVersion)) {
    nextVersion = semver.inc(nextVersion, 'prerelease', 'next');
  }
  return nextVersion;
};

const generateVersions = (versionSet, versType) => {
  switch (versType) {
    case 'major':
      return getMajorVersion(versionSet);
    case 'minor':
      return getMinorVersion(versionSet);
    case 'patch':
      return getPatchVersion(versionSet);
    case 'beta':
      return getBetaVersion(versionSet);
    case 'alpha':
      return getAlphaVersion(versionSet);
    case 'next':
      return getNextVersion(versionSet);
    default:
      return '';
  }
};

function main() {
  try {
    const versions = getVersions();
    const releaseType = process.env.RELEASE_TYPE ? process.env.RELEASE_TYPE.toLowerCase() : 'patch';

    return generateVersions(versions, releaseType);
  } catch (err) {
    console.error(err);
    return '';
  }
}

console.log(main() || '');
