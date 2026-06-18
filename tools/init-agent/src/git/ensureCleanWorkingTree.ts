import {runGit} from './runGit.js';

export async function getWorkingTreeStatus(repoRoot: string) {
  const result = await runGit(repoRoot, ['status', '--short']);
  return result.stdout;
}

export async function ensureCleanWorkingTree(repoRoot: string) {
  const status = await getWorkingTreeStatus(repoRoot);

  if (status.length > 0) {
    throw new Error(
      [
        'Working tree is not clean.',
        'Commit, stash, or remove local changes before running init-agent.',
        '',
        status,
      ].join('\n')
    );
  }
}

