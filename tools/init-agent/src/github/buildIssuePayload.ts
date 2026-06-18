import type {StepConfig, WorkflowConfig} from '../config/types.js';
import {normalizeShortTitle, renderTemplate} from './template.js';

export type IssuePayload = {
  title: string;
  body: string;
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

export function buildIssuePayload(workflow: WorkflowConfig, step: StepConfig): IssuePayload {
  const bodyConfig = workflow.github.issue.body;
  const shortTitle = normalizeShortTitle(step.title);
  const body: string[] = [];

  if (bodyConfig.includeSummary) {
    body.push('## 목적');
    body.push(step.summary ?? `${shortTitle} 작업을 진행합니다.`);
    body.push('');
  }

  if (bodyConfig.includeTasks) {
    body.push('## 작업 목록');
    body.push(formatList(step.tasks, 'step yaml을 기준으로 필요한 초기세팅 작업을 수행합니다.'));
    body.push('');
  }

  if (bodyConfig.includeAcceptanceCriteria) {
    body.push('## 완료 기준');
    body.push(formatList(step.acceptanceCriteria, '작업 결과가 step의 목적을 만족합니다.'));
    body.push('');
  }

  if (bodyConfig.includeReferences) {
    body.push('## 참고 자료');
    body.push(formatReferences(step));
    body.push('');
  }

  return {
    title: renderTemplate(workflow.github.issue.titlePattern, {shortTitle}),
    body: body.join('\n').trim(),
    labels: workflow.github.issue.labelsFromStep ? (step.labels ?? []) : [],
  };
}

