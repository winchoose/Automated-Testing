import {runGit} from './runGit.js';

export async function pushBranch(repoRoot: string, branchName: string, remote = 'origin') {
  await runGit(repoRoot, ['push', '--set-upstream', remote, branchName]);
}

