import type {AgentState, StepConfig, WorkflowConfig} from '../config/types.js';

export function getNextStep(
  workflow: WorkflowConfig,
  state: AgentState,
  steps: StepConfig[]
) {
  const stepById = new Map(steps.map((step) => [step.id, step]));

  for (const workflowStep of workflow.steps) {
    const step = stepById.get(workflowStep.id);

    if (!step || !step.enabled) {
      continue;
    }

    const currentState = state.steps[step.id];
    if (!currentState || currentState.status !== 'pending') {
      continue;
    }

    const dependenciesDone = step.dependsOn.every((dependency) =>
      state.completedSteps.includes(dependency)
    );

    if (!dependenciesDone) {
      continue;
    }

    return step;
  }

  return null;
}
