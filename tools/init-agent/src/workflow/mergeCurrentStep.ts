import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {GitHubClient} from '../github/client.js';
import {createCommitMessage} from '../github/createCommitMessage.js';
import {saveState} from '../state/saveState.js';
import {markStepCompleted, markStepFailed} from '../state/updateState.js';
import {getCurrentStep} from './getCurrentStep.js';

export type MergeCurrentStepResult = {
  stepId: string;
  pullRequestNumber: number;
  mergeSha: string;
  message: string;
};

export async function mergeCurrentStep(config: LoadedAgentConfig): Promise<MergeCurrentStepResult> {
  const {repoRoot, project, workflow} = config;
  const step = getCurrentStep(config);

  if (!step) {
    throw new Error('No running step found.');
  }

  const stepState = config.state.steps[step.id];

  if (!stepState) {
    throw new Error(`No state entry found for step '${step.id}'.`);
  }

  if (!stepState.pullRequest) {
    throw new Error(`Step '${step.id}' has no pull request number.`);
  }

  const repository = project.project.repository;
  const github = new GitHubClient({
    owner: repository.owner,
    repo: repository.name,
  });

  try {
    const pullRequest = await github.getPullRequest(stepState.pullRequest);

    if (pullRequest.merged) {
      const completedState = markStepCompleted(config.state, step.id, {merged: true});
      await saveState(repoRoot, workflow, completedState);

      return {
        stepId: step.id,
        pullRequestNumber: stepState.pullRequest,
        mergeSha: pullRequest.head.sha,
        message: 'Pull request was already merged.',
      };
    }

    if (pullRequest.state !== 'open') {
      throw new Error(`Pull request #${stepState.pullRequest} is not open.`);
    }

    if (pullRequest.mergeable === false) {
      throw new Error(`Pull request #${stepState.pullRequest} is not mergeable.`);
    }

    const merge = await github.mergePullRequest({
      pullRequestNumber: stepState.pullRequest,
      commitTitle: createCommitMessage(workflow, step),
      commitMessage: `Close #${stepState.issue ?? stepState.pullRequest}`,
      mergeMethod: workflow.github.merge.strategy === 'squash' ? 'squash' : 'merge',
    });

    if (!merge.merged) {
      throw new Error(merge.message);
    }

    const completedState = markStepCompleted(config.state, step.id, {merged: true});
    await saveState(repoRoot, workflow, completedState);

    return {
      stepId: step.id,
      pullRequestNumber: stepState.pullRequest,
      mergeSha: merge.sha,
      message: merge.message,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await saveState(repoRoot, workflow, markStepFailed(config.state, step.id, message));
    throw error;
  }
}

