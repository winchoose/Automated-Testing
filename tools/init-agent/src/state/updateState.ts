import type {AgentState} from '../config/types.js';

type StateEvent =
  | 'step:running'
  | 'step:issue-created'
  | 'step:branch-created'
  | 'step:pull-request-created'
  | 'step:committed'
  | 'step:completed'
  | 'step:failed';

function cloneState(state: AgentState): AgentState {
  return JSON.parse(JSON.stringify(state)) as AgentState;
}

function now() {
  return new Date().toISOString();
}

function appendUnique(items: string[], item: string) {
  return items.includes(item) ? items : [...items, item];
}

function removeItem(items: string[], item: string) {
  return items.filter((current) => current !== item);
}

function appendHistory(state: AgentState, stepId: string, event: StateEvent, message?: string) {
  state.history = [
    ...(state.history ?? []),
    {
      at: now(),
      step: stepId,
      event,
      ...(message ? {message} : {}),
    },
  ];
}

function ensureStep(state: AgentState, stepId: string) {
  const step = state.steps[stepId];

  if (!step) {
    throw new Error(`Unknown state step: ${stepId}`);
  }

  return step;
}

function ensureGithubState(state: AgentState) {
  state.github ??= {
    issues: {},
    pullRequests: {},
    branches: {},
  };

  return state.github;
}

export function markStepRunning(state: AgentState, stepId: string) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);

  nextState.status = 'running';
  nextState.currentStep = stepId;
  nextState.failedSteps = removeItem(nextState.failedSteps, stepId);

  step.status = 'running';

  nextState.lastRun = {
    startedAt: now(),
    finishedAt: null,
    step: stepId,
    error: null,
  };

  appendHistory(nextState, stepId, 'step:running');

  return nextState;
}

export function markIssueCreated(state: AgentState, stepId: string, issueNumber: number) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);
  const github = ensureGithubState(nextState);

  step.issue = issueNumber;
  github.issues[stepId] = issueNumber;
  appendHistory(nextState, stepId, 'step:issue-created', `#${issueNumber}`);

  return nextState;
}

export function markBranchCreated(state: AgentState, stepId: string, branchName: string) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);
  const github = ensureGithubState(nextState);

  step.branch = branchName;
  github.branches[stepId] = branchName;
  appendHistory(nextState, stepId, 'step:branch-created', branchName);

  return nextState;
}

export function markPullRequestCreated(state: AgentState, stepId: string, pullRequestNumber: number) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);
  const github = ensureGithubState(nextState);

  step.pullRequest = pullRequestNumber;
  github.pullRequests[stepId] = pullRequestNumber;
  appendHistory(nextState, stepId, 'step:pull-request-created', `#${pullRequestNumber}`);

  return nextState;
}

export function markStepCommitted(state: AgentState, stepId: string, commitSha: string) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);

  step.commit = commitSha;
  appendHistory(nextState, stepId, 'step:committed', commitSha);

  return nextState;
}

export function markStepCompleted(state: AgentState, stepId: string, options?: {merged?: boolean}) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);

  step.status = 'completed';
  step.merged = options?.merged ?? step.merged;

  nextState.currentStep = null;
  nextState.completedSteps = appendUnique(nextState.completedSteps, stepId);
  nextState.failedSteps = removeItem(nextState.failedSteps, stepId);

  if (nextState.lastRun?.step === stepId) {
    nextState.lastRun.finishedAt = now();
    nextState.lastRun.error = null;
  }

  appendHistory(nextState, stepId, 'step:completed');

  return nextState;
}

export function markStepFailed(state: AgentState, stepId: string, error: string) {
  const nextState = cloneState(state);
  const step = ensureStep(nextState, stepId);

  step.status = 'failed';

  nextState.status = 'failed';
  nextState.currentStep = stepId;
  nextState.failedSteps = appendUnique(nextState.failedSteps, stepId);
  nextState.completedSteps = removeItem(nextState.completedSteps, stepId);

  if (nextState.lastRun?.step === stepId) {
    nextState.lastRun.finishedAt = now();
    nextState.lastRun.error = error;
  }

  appendHistory(nextState, stepId, 'step:failed', error);

  return nextState;
}

