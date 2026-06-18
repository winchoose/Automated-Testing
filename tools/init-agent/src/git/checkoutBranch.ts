import {runGit} from './runGit.js';

export async function checkoutBranch(repoRoot: string, branchName: string, remote = 'origin') {
  await runGit(repoRoot, ['fetch', remote, branchName]);
  await runGit(repoRoot, ['checkout', '-B', branchName, 'FETCH_HEAD']);
}

