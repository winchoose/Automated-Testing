import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {getStepExecutor} from '../executors/registry.js';
import type {StepExecutorResult} from '../executors/types.js';
import {getCurrentStep} from './getCurrentStep.js';

export async function executeCurrentStep(config: LoadedAgentConfig): Promise<StepExecutorResult> {
  const step = getCurrentStep(config);

  if (!step) {
    throw new Error('No running step found.');
  }

  const executor = getStepExecutor(step.id);

  if (!executor) {
    throw new Error(`No executor registered for step '${step.id}'.`);
  }

  return executor(config, step);
}

