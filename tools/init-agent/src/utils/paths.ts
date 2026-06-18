import path from 'node:path';
import {access} from 'node:fs/promises';

export const agentDirectory = '.init-agent';

export function resolveRepoPath(repoRoot: string, ...segments: string[]) {
  return path.resolve(repoRoot, ...segments);
}

export function resolveAgentPath(repoRoot: string, ...segments: string[]) {
  return resolveRepoPath(repoRoot, agentDirectory, ...segments);
}

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function findRepoRoot(startDirectory = process.cwd()) {
  let currentDirectory = path.resolve(startDirectory);

  while (true) {
    const projectConfigPath = resolveAgentPath(currentDirectory, 'project.yaml');

    if (await exists(projectConfigPath)) {
      return currentDirectory;
    }

    const parentDirectory = path.dirname(currentDirectory);
    if (parentDirectory === currentDirectory) {
      throw new Error(`Could not find ${agentDirectory}/project.yaml from ${startDirectory}`);
    }

    currentDirectory = parentDirectory;
  }
}
