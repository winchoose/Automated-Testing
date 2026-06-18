import {access} from 'node:fs/promises';
import path from 'node:path';
import {loadYamlFile} from './loadYaml.js';
import type {AgentState, ProjectConfig, StepConfig, WorkflowConfig} from './types.js';
import {findRepoRoot, resolveAgentPath, resolveRepoPath} from '../utils/paths.js';

export type LoadedAgentConfig = {
  repoRoot: string;
  project: ProjectConfig;
  workflow: WorkflowConfig;
  state: AgentState;
  steps: StepConfig[];
};

export async function loadAgentConfig(startDirectory = process.cwd()): Promise<LoadedAgentConfig> {
  const repoRoot = await findRepoRoot(startDirectory);
  const project = await loadYamlFile<ProjectConfig>(resolveAgentPath(repoRoot, 'project.yaml'));
  const workflow = await loadYamlFile<WorkflowConfig>(resolveAgentPath(repoRoot, 'workflow.yaml'));
  const state = await loadYamlFile<AgentState>(resolveAgentPath(repoRoot, 'state.yaml'));

  const steps = await Promise.all(
    workflow.steps.map((step) =>
      loadYamlFile<StepConfig>(resolveAgentPath(repoRoot, step.file))
    )
  );

  return {repoRoot, project, workflow, state, steps};
}

export async function pathExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function resolveReferencePath(repoRoot: string, referencePath: string) {
  return resolveAgentPath(repoRoot, referencePath);
}

export function resolveStepFilePath(repoRoot: string, stepFile: string) {
  return resolveAgentPath(repoRoot, stepFile);
}

export function displayPath(repoRoot: string, filePath: string) {
  return path.relative(repoRoot, filePath) || '.';
}

export {resolveRepoPath};
