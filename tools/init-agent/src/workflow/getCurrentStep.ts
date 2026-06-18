import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';

export function getCurrentStep(config: LoadedAgentConfig) {
  const currentStepId = config.state.currentStep;

  if (!currentStepId) {
    return null;
  }

  return config.steps.find((step) => step.id === currentStepId) ?? null;
}

