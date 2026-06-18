import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {pathExists, resolveRepoPath} from '../config/loadAgentConfig.js';

type PackageJson = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

export async function ensureDir(repoRoot: string, relativePath: string) {
  await mkdir(resolveRepoPath(repoRoot, relativePath), {recursive: true});
  return relativePath;
}

export async function writeText(repoRoot: string, relativePath: string, content: string) {
  const filePath = resolveRepoPath(repoRoot, relativePath);
  await mkdir(path.dirname(filePath), {recursive: true});
  await writeFile(filePath, content.trimEnd() + '\n', 'utf8');
  return relativePath;
}

export async function readTextIfExists(repoRoot: string, relativePath: string) {
  const filePath = resolveRepoPath(repoRoot, relativePath);
  if (!(await pathExists(filePath))) {
    return null;
  }

  return readFile(filePath, 'utf8');
}

export async function updatePackageJson(
  repoRoot: string,
  relativePath: string,
  updater: (packageJson: PackageJson) => PackageJson
) {
  const filePath = resolveRepoPath(repoRoot, relativePath);
  const packageJson = JSON.parse(await readFile(filePath, 'utf8')) as PackageJson;
  const nextPackageJson = updater(packageJson);

  await writeFile(filePath, `${JSON.stringify(nextPackageJson, null, 2)}\n`, 'utf8');
  return relativePath;
}

export function mergeRecord(
  current: Record<string, string> | undefined,
  additions: Record<string, string>
) {
  return {
    ...(current ?? {}),
    ...additions,
  };
}

