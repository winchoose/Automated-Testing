import type {StepConfig, WorkflowConfig} from '../config/types.js';
import {normalizeShortTitle, renderTemplate} from './template.js';

export function createCommitMessage(workflow: WorkflowConfig, step: StepConfig) {
  return renderTemplate(workflow.github.commit.messagePattern, {
    shortTitle: normalizeShortTitle(step.title),
  });
}

