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
    enabled: boolean;
    issue: {
      create: boolean;
      titlePattern: string;
      labelsFromStep: boolean;
      body: {
        includeSummary: boolean;
        includeTasks: boolean;
        includeAcceptanceCriteria: boolean;
        includeReferences: boolean;
      };
    };
    branch: {
      create: boolean;
      namePattern: string;
      baseBranch: string;
    };
    commit: {
      create: boolean;
      messagePattern: string;
    };
    pullRequest: {
      create: boolean;
      draft: boolean;
      titlePattern: string;
      labelsFromStep: boolean;
      body: {
        includeSummary: boolean;
        includeChanges: boolean;
        includeVerification: boolean;
        includeReferences: boolean;
        includeRelatedIssue: boolean;
      };
    };
    merge: {
      enabled: boolean;
      strategy: string;
      waitForChecks: boolean;
      deleteBranchAfterMerge: boolean;
      stopIfChecksFail: boolean;
      requireHumanApproval: boolean;
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
  summary?: string;
  labels?: string[];
  dependsOn: string[];
  decision?: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  references?: Array<{
    path: string;
    type?: string;
    required?: boolean;
  }>;
  tasks?: string[];
  acceptanceCriteria?: string[];
  files?: {
    expected?: string[];
    avoid?: string[];
  };
  verification?: string[];
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
  github?: {
    issues: Record<string, number>;
    pullRequests: Record<string, number>;
    branches: Record<string, string>;
  };
  lastRun?: {
    startedAt: string | null;
    finishedAt: string | null;
    step: string | null;
    error: string | null;
  };
  history?: Array<{
    at: string;
    step: string;
    event: string;
    message?: string;
  }>;
};
