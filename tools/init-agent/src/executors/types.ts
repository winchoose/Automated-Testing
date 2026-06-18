import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import type {StepConfig} from '../config/types.js';

export type StepExecutorResult = {
  stepId: string;
  changedFiles: string[];
  message: string;
};

export type StepExecutor = (
  config: LoadedAgentConfig,
  step: StepConfig
) => Promise<StepExecutorResult>;

