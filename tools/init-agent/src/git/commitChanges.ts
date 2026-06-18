import {runGit} from './runGit.js';

export async function hasChanges(repoRoot: string) {
  const result = await runGit(repoRoot, ['status', '--short']);
  return result.stdout.length > 0;
}

export async function commitChanges(repoRoot: string, message: string) {
  if (!(await hasChanges(repoRoot))) {
    throw new Error('No changes to commit.');
  }

  await runGit(repoRoot, ['add', '--all']);
  await runGit(repoRoot, ['commit', '-m', message]);
  const result = await runGit(repoRoot, ['rev-parse', 'HEAD']);

  return result.stdout;
}

