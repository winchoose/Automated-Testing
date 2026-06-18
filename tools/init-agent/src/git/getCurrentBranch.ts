import {runGit} from './runGit.js';

export async function getCurrentBranch(repoRoot: string) {
  const result = await runGit(repoRoot, ['branch', '--show-current']);
  return result.stdout;
}

