import type {AgentState} from '../config/types.js';

export function formatStatePreview(before: AgentState, after: AgentState, stepId: string) {
  const beforeStep = before.steps[stepId];
  const afterStep = after.steps[stepId];

  return [
    'state preview:',
    `- status: ${before.status} -> ${after.status}`,
    `- currentStep: ${before.currentStep ?? 'none'} -> ${after.currentStep ?? 'none'}`,
    `- step.${stepId}.status: ${beforeStep?.status ?? 'none'} -> ${afterStep?.status ?? 'none'}`,
    `- history: ${(before.history ?? []).length} -> ${(after.history ?? []).length}`,
  ].join('\n');
}

