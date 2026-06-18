import type {AgentState} from '../config/types.js';

export function formatStatus(state: AgentState) {
  const lines: string[] = [];
  const entries = Object.entries(state.steps);
  const byStatus = (status: string) =>
    entries.filter(([, step]) => step.status === status).map(([id]) => id);

  lines.push(`status: ${state.status}`);
  lines.push(`currentStep: ${state.currentStep ?? 'none'}`);
  lines.push('');
  lines.push(`pending: ${byStatus('pending').length}`);
  for (const id of byStatus('pending')) {
    lines.push(`- ${id}`);
  }
  lines.push('');
  lines.push(`completed: ${state.completedSteps.length}`);
  for (const id of state.completedSteps) {
    lines.push(`- ${id}`);
  }
  lines.push('');
  lines.push(`failed: ${state.failedSteps.length}`);
  for (const id of state.failedSteps) {
    lines.push(`- ${id}`);
  }

  return lines.join('\n');
}
