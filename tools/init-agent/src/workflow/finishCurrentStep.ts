import {exec} from 'node:child_process';
import {access, readFile} from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';
import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {commitChanges} from '../git/commitChanges.js';
import {pushBranch} from '../git/pushBranch.js';
import {buildGitHubPlan} from '../github/buildGitHubPlan.js';
import {GitHubClient} from '../github/client.js';
import {createCommitMessage} from '../github/createCommitMessage.js';
import {saveState} from '../state/saveState.js';
import {markPullRequestCreated, markStepCommitted, markStepFailed} from '../state/updateState.js';
import {runVerification} from '../verification/runVerification.js';
import {getCurrentStep} from './getCurrentStep.js';

const execAsync = promisify(exec);

export type FinishCurrentStepResult = {
  stepId: string;
  commitSha: string;
  pullRequestNumber: number;
  pullRequestUrl: string;
  verificationCommands: string[];
};

async function runAppFormatterIfAvailable(repoRoot: string) {
  try {
    const packageJsonPath = path.join(repoRoot, 'app/package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>;
    };

    if (!packageJson.scripts?.format) {
      return;
    }

    await access(path.join(repoRoot, 'app/node_modules/.bin/prettier'));

    await execAsync('pnpm --dir app format', {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 10,
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

export async function finishCurrentStep(config: LoadedAgentConfig): Promise<FinishCurrentStepResult> {
  const {repoRoot, project, workflow} = config;
  const step = getCurrentStep(config);

  if (!step) {
    throw new Error('No running step found.');
  }

  const stepState = config.state.steps[step.id];

  if (!stepState) {
    throw new Error(`No state entry found for step '${step.id}'.`);
  }

  if (stepState.status !== 'running') {
    throw new Error(`Step '${step.id}' is not running.`);
  }

  if (!stepState.issue) {
    throw new Error(`Step '${step.id}' has no issue number.`);
  }

  if (!stepState.branch) {
    throw new Error(`Step '${step.id}' has no branch name.`);
  }

  let nextState = config.state;

  try {
    await runAppFormatterIfAvailable(repoRoot);
    const verificationResults = await runVerification(repoRoot, step.verification ?? []);
    const commitSha = await commitChanges(repoRoot, createCommitMessage(workflow, step));

    nextState = markStepCommitted(nextState, step.id, commitSha);
    await saveState(repoRoot, workflow, nextState);

    await pushBranch(repoRoot, stepState.branch);

    const repository = project.project.repository;
    const github = new GitHubClient({
      owner: repository.owner,
      repo: repository.name,
    });
    const plan = buildGitHubPlan(workflow, step, stepState.issue);
    const pullRequest = await github.createPullRequest({
      title: plan.pullRequest.title,
      body: plan.pullRequest.body,
      head: stepState.branch,
      base: workflow.github.branch.baseBranch,
      draft: plan.pullRequest.draft,
    });

    nextState = markPullRequestCreated(nextState, step.id, pullRequest.number);
    await saveState(repoRoot, workflow, nextState);

    return {
      stepId: step.id,
      commitSha,
      pullRequestNumber: pullRequest.number,
      pullRequestUrl: pullRequest.html_url,
      verificationCommands: verificationResults.map((result) => result.command),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await saveState(repoRoot, workflow, markStepFailed(nextState, step.id, message));
    throw error;
  }
}
