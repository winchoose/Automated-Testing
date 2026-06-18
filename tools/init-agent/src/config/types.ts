export type WorkflowStep = {
  id: string;
  file: string;
};

export type WorkflowConfig = {
  workflow: {
    name: string;
    mode: string;
    stopOnFailure: boolean;
  };
  execution: {
    stateFile: string;
  };
  github: {
    branch: {
      baseBranch: string;
    };
  };
  steps: WorkflowStep[];
};

export type ProjectConfig = {
  project: {
    name: string;
    repository: {
      owner: string;
      name: string;
      defaultBranch: string;
    };
  };
};

export type StepConfig = {
  id: string;
  title: string;
  order: number;
  enabled: boolean;
  dependsOn: string[];
  references?: Array<{
    path: string;
    required?: boolean;
  }>;
};

export type StepState = {
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  issue: number | null;
  pullRequest: number | null;
  branch: string | null;
  commit: string | null;
  merged: boolean;
};

export type AgentState = {
  status: 'idle' | 'running' | 'failed' | 'completed';
  currentStep: string | null;
  completedSteps: string[];
  failedSteps: string[];
  skippedSteps: string[];
  steps: Record<string, StepState>;
};
