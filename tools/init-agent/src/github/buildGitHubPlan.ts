import type {StepConfig, WorkflowConfig} from '../config/types.js';
import {buildIssuePayload} from './buildIssuePayload.js';
import {buildPullRequestPayload} from './buildPullRequestPayload.js';
import {createBranchName} from './createBranchName.js';
import {createCommitMessage} from './createCommitMessage.js';

export function buildGitHubPlan(
  workflow: WorkflowConfig,
  step: StepConfig,
  issueNumber = 0
) {
  return {
    issue: buildIssuePayload(workflow, step),
    branchName: createBranchName(workflow, step, issueNumber),
    commitMessage: createCommitMessage(workflow, step),
    pullRequest: buildPullRequestPayload(workflow, step, issueNumber),
  };
}

