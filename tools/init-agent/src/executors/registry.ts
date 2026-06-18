import type {StepExecutor} from './types.js';
import {executeIssuePrTemplate} from './issuePrTemplate.js';

const executors = new Map<string, StepExecutor>([
  ['issue-pr-template', executeIssuePrTemplate],
]);

export function getStepExecutor(stepId: string) {
  return executors.get(stepId) ?? null;
}

export function hasStepExecutor(stepId: string) {
  return executors.has(stepId);
}

export function listExecutableStepIds() {
  return [...executors.keys()];
}

