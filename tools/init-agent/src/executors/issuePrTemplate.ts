import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
import type {StepExecutor} from './types.js';
import {resolveAgentPath, resolveRepoPath} from '../utils/paths.js';

type TemplateTarget = {
  source: string;
  target: string;
  fallback: string;
};

const targets: TemplateTarget[] = [
  {
    source: 'references/github-templates/issue-template/init_setup.md',
    target: '.github/ISSUE_TEMPLATE/init_task.md',
    fallback: `---
name: Init setup
about: Create an initialization setup task
title: "[Init] "
labels: "Init"
assignees: ""
---

## 목적

## 작업 목록

- [ ] TODO

## 완료 기준

- [ ] TODO

## 참고 자료
`,
  },
  {
    source: 'references/github-templates/issue-template/bug_report.md',
    target: '.github/ISSUE_TEMPLATE/bug_report.md',
    fallback: `---
name: Bug report
about: Create a report to help us improve
title: "[Fix] "
labels: "Bug"
assignees: ""
---

## 어떤 버그인가요?

## 재현 방법

## 예상 결과

## 참고 자료
`,
  },
  {
    source: 'references/github-templates/issue-template/feature_request.md',
    target: '.github/ISSUE_TEMPLATE/feature_request.md',
    fallback: `---
name: Feature request
about: Suggest an idea for this project
title: "[Feat] "
labels: "Feature"
assignees: ""
---

## 목적

## 작업 목록

- [ ] TODO

## 완료 기준

- [ ] TODO

## 참고 자료
`,
  },
  {
    source: 'references/github-templates/pull-request-template.md',
    target: '.github/pull_request_template.md',
    fallback: `## ISSUE

<!-- close #issue-number -->

## What is this PR?

## Screenshot

## Test Checklist

- [ ] TODO

## 참고 자료
`,
  },
];

async function readReferenceOrFallback(repoRoot: string, target: TemplateTarget) {
  try {
    return await readFile(resolveAgentPath(repoRoot, target.source), 'utf8');
  } catch {
    return target.fallback;
  }
}

export const executeIssuePrTemplate: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  for (const target of targets) {
    const content = await readReferenceOrFallback(config.repoRoot, target);
    const outputPath = resolveRepoPath(config.repoRoot, target.target);

    await mkdir(path.dirname(outputPath), {recursive: true});
    await writeFile(outputPath, content.trimEnd() + '\n', 'utf8');
    changedFiles.push(target.target);
  }

  return {
    stepId: step.id,
    changedFiles,
    message: 'GitHub issue and pull request templates were generated.',
  };
};

