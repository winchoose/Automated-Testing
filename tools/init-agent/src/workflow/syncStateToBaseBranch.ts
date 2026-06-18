import {readFile, writeFile} from 'node:fs/promises';
import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {resolveRepoPath} from '../config/loadAgentConfig.js';
import {hasChanges} from '../git/commitChanges.js';
import {runGit} from '../git/runGit.js';

export async function syncStateToBaseBranch(config: LoadedAgentConfig, stepId: string) {
  const statePath = resolveRepoPath(config.repoRoot, config.workflow.execution.stateFile);
  const stateContent = await readFile(statePath, 'utf8');
  const baseBranch = config.workflow.github.branch.baseBranch;

  await runGit(config.repoRoot, ['fetch', 'origin', baseBranch]);
  await runGit(config.repoRoot, ['checkout', '-f', baseBranch]);
  await runGit(config.repoRoot, ['merge', '--ff-only', `origin/${baseBranch}`]);
  await writeFile(statePath, stateContent, 'utf8');

  if (await hasChanges(config.repoRoot)) {
    await runGit(config.repoRoot, ['add', config.workflow.execution.stateFile]);
    await runGit(config.repoRoot, ['commit', '-m', `init: ${stepId} 상태 동기화`]);
    await runGit(config.repoRoot, ['push', 'origin', baseBranch]);
  }
}

