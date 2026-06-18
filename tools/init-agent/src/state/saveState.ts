import {writeFile} from 'node:fs/promises';
import YAML from 'yaml';
import type {AgentState, WorkflowConfig} from '../config/types.js';
import {resolveRepoPath} from '../utils/paths.js';

export async function saveState(repoRoot: string, workflow: WorkflowConfig, state: AgentState) {
  const statePath = resolveRepoPath(repoRoot, workflow.execution.stateFile);
  const content = YAML.stringify(state, {
    nullStr: 'null',
    lineWidth: 0,
  });

  await writeFile(statePath, content, 'utf8');
}

