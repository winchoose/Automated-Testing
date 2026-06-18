import type {StepConfig, WorkflowConfig} from '../config/types.js';
import {renderTemplate} from './template.js';

export function createBranchName(workflow: WorkflowConfig, step: StepConfig, issueNumber: number) {
  return renderTemplate(workflow.github.branch.namePattern, {
    shortDescription: step.id,
    issueNumber,
  });
}

