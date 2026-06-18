#!/usr/bin/env node
import {loadAgentConfig} from './config/loadAgentConfig.js';
import {buildExecutionContext} from './context/buildExecutionContext.js';
import {buildGitHubPlan} from './github/buildGitHubPlan.js';
import {formatStatePreview} from './state/formatStatePreview.js';
import {formatStatus} from './state/formatStatus.js';
import {markStepRunning} from './state/updateState.js';
import {finishCurrentStep} from './workflow/finishCurrentStep.js';
import {getNextStep} from './workflow/getNextStep.js';
import {mergeCurrentStep} from './workflow/mergeCurrentStep.js';
import {planRunAll} from './workflow/runAll.js';
import {startNextStep} from './workflow/startNextStep.js';
import {validateWorkflow} from './workflow/validateWorkflow.js';

const [, , command = 'help', ...args] = process.argv;

async function doctor() {
  const config = await loadAgentConfig();
  const result = await validateWorkflow(config);

  console.log(`project: ${config.project.project.name}`);
  console.log(`repository: ${config.project.project.repository.owner}/${config.project.project.repository.name}`);
  console.log(`workflow: ${config.workflow.workflow.name}`);
  console.log(`steps: ${config.workflow.steps.length}`);
  console.log('');

  if (result.warnings.length > 0) {
    console.log('warnings:');
    for (const warning of result.warnings) {
      console.log(`- ${warning}`);
    }
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log('errors:');
    for (const error of result.errors) {
      console.log(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('doctor: ok');
}

async function status() {
  const config = await loadAgentConfig();
  console.log(formatStatus(config.state));
}

async function context() {
  const config = await loadAgentConfig();
  const stepId = args.find((arg) => !arg.startsWith('--'));
  const step = stepId
    ? config.steps.find((candidate) => candidate.id === stepId)
    : getNextStep(config.workflow, config.state, config.steps);

  if (!step) {
    console.log(stepId ? `Step not found: ${stepId}` : 'No runnable pending step found.');
    process.exitCode = 1;
    return;
  }

  console.log(await buildExecutionContext(config, step));
}

async function next() {
  const dryRun = args.includes('--dry-run');
  const config = await loadAgentConfig();
  const step = getNextStep(config.workflow, config.state, config.steps);

  if (!step) {
    console.log('No runnable pending step found.');
    return;
  }

  console.log(`next step: ${step.id}`);
  console.log(`title: ${step.title}`);

  if (dryRun) {
    const dryRunIssueNumber = 0;
    const plan = buildGitHubPlan(config.workflow, step, dryRunIssueNumber);

    console.log('');
    console.log('github plan:');
    console.log(`- issue title: ${plan.issue.title}`);
    console.log(`- issue labels: ${plan.issue.labels.join(', ') || 'none'}`);
    console.log(`- branch: ${plan.branchName} (issue number placeholder: ${dryRunIssueNumber})`);
    console.log(`- commit: ${plan.commitMessage}`);
    console.log(`- pr title: ${plan.pullRequest.title}`);
    console.log(`- pr draft: ${plan.pullRequest.draft}`);
    console.log(`- pr labels: ${plan.pullRequest.labels.join(', ') || 'none'}`);
    console.log('');
    console.log(formatStatePreview(config.state, markStepRunning(config.state, step.id), step.id));
    console.log('');
    console.log('dry-run: no files, git, or GitHub state will be changed.');
    return;
  }

  const result = await startNextStep(config, step);

  console.log('');
  console.log('started:');
  console.log(`- issue: #${result.issueNumber} ${result.issueUrl}`);
  console.log(`- branch: ${result.branchName}`);
  console.log(`- checked out: ${result.checkedOut}`);
  console.log('');
  console.log('state.yaml updated.');
}

async function finish() {
  const config = await loadAgentConfig();
  const result = await finishCurrentStep(config);

  console.log('finished current step work:');
  console.log(`- step: ${result.stepId}`);
  console.log(`- commit: ${result.commitSha}`);
  console.log(`- pull request: #${result.pullRequestNumber} ${result.pullRequestUrl}`);
  console.log(`- verification: ${result.verificationCommands.join(', ') || 'none'}`);
  console.log('');
  console.log('state.yaml updated.');
}

async function merge() {
  const config = await loadAgentConfig();
  const result = await mergeCurrentStep(config);

  console.log('merged current step:');
  console.log(`- step: ${result.stepId}`);
  console.log(`- pull request: #${result.pullRequestNumber}`);
  console.log(`- merge sha: ${result.mergeSha}`);
  console.log(`- message: ${result.message}`);
  console.log('');
  console.log('state.yaml updated.');
}

async function runAll() {
  const config = await loadAgentConfig();
  const plan = planRunAll(config);

  console.log('run-all plan:');
  console.log(`- mode: ${plan.mode}`);
  console.log(`- message: ${plan.message}`);
  console.log(`- current step: ${plan.currentStepId ?? 'none'}`);
  console.log(`- next step: ${plan.nextStepId ?? 'none'}`);
  console.log('');
  console.log('Full automatic step execution will be connected after the step executor is implemented.');
}

function help() {
  console.log(`init-agent

Commands:
  doctor          Validate .init-agent files
  status          Print current state
  context [step]  Print the execution context for a step
  next --dry-run  Show the next runnable step
  next            Create the issue and branch for the next runnable step
  finish          Verify, commit, push, and create a PR for the running step
  merge           Merge the running step PR and mark the step completed
  run-all         Show the current run-all continuation plan
`);
}

try {
  if (command === 'doctor') {
    await doctor();
  } else if (command === 'status') {
    await status();
  } else if (command === 'context') {
    await context();
  } else if (command === 'next') {
    await next();
  } else if (command === 'finish') {
    await finish();
  } else if (command === 'merge') {
    await merge();
  } else if (command === 'run-all') {
    await runAll();
  } else {
    help();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
