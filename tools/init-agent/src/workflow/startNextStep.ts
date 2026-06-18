import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import type {StepConfig} from '../config/types.js';
import {checkoutBranch} from '../git/checkoutBranch.js';
import {ensureCleanWorkingTree} from '../git/ensureCleanWorkingTree.js';
import {buildGitHubPlan} from '../github/buildGitHubPlan.js';
import {GitHubClient} from '../github/client.js';
import {saveState} from '../state/saveState.js';
import {markBranchCreated, markIssueCreated, markStepFailed, markStepRunning} from '../state/updateState.js';

export type StartNextStepResult = {
  step: StepConfig;
  issueNumber: number;
  issueUrl: string;
  branchName: string;
  checkedOut: boolean;
};

export async function startNextStep(config: LoadedAgentConfig, step: StepConfig): Promise<StartNextStepResult> {
  const {repoRoot, project, workflow} = config;
  const repository = project.project.repository;
  const github = new GitHubClient({
    owner: repository.owner,
    repo: repository.name,
  });

  await ensureCleanWorkingTree(repoRoot);

  let nextState = markStepRunning(config.state, step.id);
  await saveState(repoRoot, workflow, nextState);

  try {
    const issuePlan = buildGitHubPlan(workflow, step);
    const issue = await github.createIssue(issuePlan.issue);

    nextState = markIssueCreated(nextState, step.id, issue.number);
    await saveState(repoRoot, workflow, nextState);

    const plan = buildGitHubPlan(workflow, step, issue.number);
    const baseRef = await github.getBranchRef(workflow.github.branch.baseBranch);
    await github.createBranch(plan.branchName, baseRef.object.sha);
    await checkoutBranch(repoRoot, plan.branchName);

    nextState = markBranchCreated(nextState, step.id, plan.branchName);
    await saveState(repoRoot, workflow, nextState);

    return {
      step,
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      branchName: plan.branchName,
      checkedOut: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await saveState(repoRoot, workflow, markStepFailed(nextState, step.id, message));
    throw error;
  }
}
