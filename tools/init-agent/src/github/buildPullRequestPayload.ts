import type {StepConfig, WorkflowConfig} from '../config/types.js';
import {normalizeShortTitle, renderTemplate} from './template.js';

export type PullRequestPayload = {
  title: string;
  body: string;
  draft: boolean;
  labels: string[];
};

function formatList(items: string[] | undefined, fallback: string) {
  if (!items || items.length === 0) {
    return `- ${fallback}`;
  }

  return items.map((item) => `- ${item}`).join('\n');
}

function formatReferences(step: StepConfig) {
  if (!step.references || step.references.length === 0) {
    return '- 참고 자료 없음';
  }

  return step.references.map((reference) => `- ${reference.path}`).join('\n');
}

export function buildPullRequestPayload(
  workflow: WorkflowConfig,
  step: StepConfig,
  issueNumber: number
): PullRequestPayload {
  const bodyConfig = workflow.github.pullRequest.body;
  const shortTitle = normalizeShortTitle(step.title);
  const body: string[] = [];

  if (bodyConfig.includeRelatedIssue) {
    body.push('## ISSUE');
    body.push(`close #${issueNumber}`);
    body.push('');
  }

  if (bodyConfig.includeSummary) {
    body.push('## What is this PR?');
    body.push(step.summary ?? `${shortTitle} 작업을 진행했습니다.`);
    body.push('');
  }

  if (bodyConfig.includeChanges) {
    body.push('## Changes');
    body.push(formatList(step.tasks, 'step yaml을 기준으로 초기세팅 작업을 반영했습니다.'));
    body.push('');
  }

  body.push('## Screenshot');
  body.push('- 해당 없음');
  body.push('');

  if (bodyConfig.includeVerification) {
    body.push('## Test Checklist');
    body.push(formatList(step.verification, '검증 명령어는 작업 결과에 맞게 PR에서 기록합니다.'));
    body.push('');
  }

  if (bodyConfig.includeReferences) {
    body.push('## 참고 자료');
    body.push(formatReferences(step));
    body.push('');
  }

  return {
    title: renderTemplate(workflow.github.pullRequest.titlePattern, {shortTitle}),
    body: body.join('\n').trim(),
    draft: workflow.github.pullRequest.draft,
    labels: workflow.github.pullRequest.labelsFromStep ? (step.labels ?? []) : [],
  };
}

