import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {getCurrentStep} from './getCurrentStep.js';
import {getNextStep} from './getNextStep.js';

export type RunAllPlan = {
  mode: 'needs-work' | 'ready-for-next' | 'complete';
  message: string;
  currentStepId: string | null;
  nextStepId: string | null;
};

export function planRunAll(config: LoadedAgentConfig): RunAllPlan {
  const currentStep = getCurrentStep(config);

  if (currentStep) {
    return {
      mode: 'needs-work',
      message:
        'A step is already running. Finish and merge it before run-all can continue automatically.',
      currentStepId: currentStep.id,
      nextStepId: null,
    };
  }

  const nextStep = getNextStep(config.workflow, config.state, config.steps);

  if (!nextStep) {
    return {
      mode: 'complete',
      message: 'No runnable pending step found.',
      currentStepId: null,
      nextStepId: null,
    };
  }

  return {
    mode: 'ready-for-next',
    message:
      'run-all can start the next step, but code execution is not automated yet. Use next, perform the step work, then finish and merge.',
    currentStepId: null,
    nextStepId: nextStep.id,
  };
}

