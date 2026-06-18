import type {StepExecutor} from './types.js';
import {writeText} from './utils.js';

export const executeProjectBaseline: StepExecutor = async (config, step) => {
  const {project, workflow} = config;
  const repository = project.project.repository;
  const baseBranch = workflow.github.branch.baseBranch || repository.defaultBranch;

  const changedFiles = [
    await writeText(
      config.repoRoot,
      '.init-agent/baseline.md',
      `# Project Baseline

## Repository

- Owner: ${repository.owner}
- Name: ${repository.name}
- Base branch: ${baseBranch}

## Automation

- Workflow: ${workflow.workflow.name}
- Mode: ${workflow.workflow.mode}
- State file: ${workflow.execution.stateFile}
- Step count: ${workflow.steps.length}
- Auto merge: ${String(workflow.github.merge.enabled)}
- Merge strategy: ${workflow.github.merge.strategy}

## Initial State

- README.md is expected to exist before app generation.
- app/package.json is expected to be created by the React step.
- .init-agent is the automation instruction directory.
`
    ),
  ];

  return {
    stepId: step.id,
    changedFiles,
    message: 'Project baseline was recorded for the init-agent workflow.',
  };
};
