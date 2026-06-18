import {loadAgentConfig} from '../config/loadAgentConfig.js';
import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {hasStepExecutor, listExecutableStepIds} from '../executors/registry.js';
import {checkoutBranch} from '../git/checkoutBranch.js';
import {saveState} from '../state/saveState.js';
import {markStepRunning} from '../state/updateState.js';
import {executeCurrentStep} from './executeCurrentStep.js';
import {finishCurrentStep} from './finishCurrentStep.js';
import {getCurrentStep} from './getCurrentStep.js';
import {getNextStep} from './getNextStep.js';
import {mergeCurrentStep} from './mergeCurrentStep.js';
import {startNextStep} from './startNextStep.js';
import {syncStateToBaseBranch} from './syncStateToBaseBranch.js';

export type RunAllPlan = {
  mode: 'needs-work' | 'ready-for-next' | 'complete';
  message: string;
  currentStepId: string | null;
  nextStepId: string | null;
};

export type RunAllEvent = {
  stepId: string;
  phase: 'start' | 'retry' | 'execute' | 'finish' | 'merge' | 'stop';
  message: string;
};

export type RunAllResult = {
  events: RunAllEvent[];
  stoppedBecause: string | null;
};

export function planRunAll(config: LoadedAgentConfig): RunAllPlan {
  const currentStep = getCurrentStep(config);

  if (currentStep) {
    return {
      mode: 'needs-work',
      message:
        hasStepExecutor(currentStep.id)
          ? 'A step is already running and has an executor. run-all can continue from execute.'
          : 'A step is already running, but no executor is registered for it.',
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
    message: hasStepExecutor(nextStep.id)
      ? 'run-all can start and execute the next step.'
      : `No executor registered for '${nextStep.id}'. Registered executors: ${listExecutableStepIds().join(', ') || 'none'}.`,
    currentStepId: null,
    nextStepId: nextStep.id,
  };
}

export async function runAll(startDirectory = process.cwd()): Promise<RunAllResult> {
  const events: RunAllEvent[] = [];

  while (true) {
    let config = await loadAgentConfig(startDirectory);
    let step = getCurrentStep(config);

    if (!step) {
      step = getNextStep(config.workflow, config.state, config.steps);

      if (!step) {
        return {events, stoppedBecause: null};
      }

      if (!hasStepExecutor(step.id)) {
        return {
          events: [
            ...events,
            {
              stepId: step.id,
              phase: 'stop',
              message: `No executor registered for step '${step.id}'.`,
            },
          ],
          stoppedBecause: `No executor registered for step '${step.id}'.`,
        };
      }

      events.push({
        stepId: step.id,
        phase: 'start',
        message: 'Creating issue and branch.',
      });
      await startNextStep(config, step);
      config = await loadAgentConfig(startDirectory);
      step = getCurrentStep(config);
    }

    if (!step) {
      throw new Error('Expected a running step after startNextStep.');
    }

    if (!hasStepExecutor(step.id)) {
      return {
        events: [
          ...events,
          {
            stepId: step.id,
            phase: 'stop',
            message: `No executor registered for running step '${step.id}'.`,
          },
        ],
        stoppedBecause: `No executor registered for running step '${step.id}'.`,
      };
    }

    const stepState = config.state.steps[step.id];

    if (stepState?.status === 'failed') {
      events.push({
        stepId: step.id,
        phase: 'retry',
        message: 'Retrying failed step from its existing issue and branch.',
      });

      const retryState = markStepRunning(config.state, step.id);
      await saveState(config.repoRoot, config.workflow, retryState);

      if (stepState.branch) {
        await checkoutBranch(config.repoRoot, stepState.branch);
      }

      config = await loadAgentConfig(startDirectory);
    }

    events.push({
      stepId: step.id,
      phase: 'execute',
      message: 'Executing step changes.',
    });
    await executeCurrentStep(config);

    config = await loadAgentConfig(startDirectory);
    events.push({
      stepId: step.id,
      phase: 'finish',
      message: 'Verifying, committing, pushing, and creating a PR.',
    });
    await finishCurrentStep(config);

    config = await loadAgentConfig(startDirectory);
    events.push({
      stepId: step.id,
      phase: 'merge',
      message: 'Merging the PR and marking the step completed.',
    });
    await mergeCurrentStep(config);
    await syncStateToBaseBranch(config, step.id);
  }
}
