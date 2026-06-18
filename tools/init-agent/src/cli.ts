#!/usr/bin/env node
import {loadAgentConfig} from './config/loadAgentConfig.js';
import {formatStatus} from './state/formatStatus.js';
import {getNextStep} from './workflow/getNextStep.js';
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
    console.log('dry-run: no files, git, or GitHub state will be changed.');
    return;
  }

  console.log('Execution is not implemented yet. Use --dry-run for now.');
  process.exitCode = 1;
}

function help() {
  console.log(`init-agent

Commands:
  doctor          Validate .init-agent files
  status          Print current state
  next --dry-run  Show the next runnable step
`);
}

try {
  if (command === 'doctor') {
    await doctor();
  } else if (command === 'status') {
    await status();
  } else if (command === 'next') {
    await next();
  } else {
    help();
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
