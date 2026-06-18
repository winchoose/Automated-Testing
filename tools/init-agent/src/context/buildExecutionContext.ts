import YAML from 'yaml';
import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import type {StepConfig} from '../config/types.js';
import {loadConventions} from './loadConventions.js';
import {loadReferences} from './loadReferences.js';

function formatYamlBlock(value: unknown) {
  if (value === undefined) {
    return null;
  }

  return ['```yaml', YAML.stringify(value).trim(), '```'].join('\n');
}

function formatList(title: string, items: string[] | undefined) {
  if (!items || items.length === 0) {
    return [`## ${title}`, '- 없음'].join('\n');
  }

  return [`## ${title}`, ...items.map((item) => `- ${item}`)].join('\n');
}

function codeFenceForPath(filePath: string) {
  const extension = filePath.split('.').pop()?.toLowerCase();

  if (!extension) {
    return '';
  }

  if (extension === 'md') {
    return 'markdown';
  }

  if (extension === 'yml') {
    return 'yaml';
  }

  return extension;
}

export async function buildExecutionContext(config: LoadedAgentConfig, step: StepConfig) {
  const conventions = await loadConventions(config.repoRoot);
  const references = await loadReferences(config.repoRoot, step);
  const sections: string[] = [];

  sections.push(`# ${step.title}`);
  sections.push(`stepId: ${step.id}`);
  sections.push(`repository: ${config.project.project.repository.owner}/${config.project.project.repository.name}`);
  sections.push(`baseBranch: ${config.workflow.github.branch.baseBranch}`);
  sections.push('');

  sections.push('## Goal');
  sections.push(step.summary ?? '이 step의 초기세팅 작업을 수행합니다.');
  sections.push('');

  const decision = formatYamlBlock(step.decision);
  if (decision) {
    sections.push('## Decision');
    sections.push(decision);
    sections.push('');
  }

  const inputs = formatYamlBlock(step.inputs);
  if (inputs) {
    sections.push('## Inputs');
    sections.push(inputs);
    sections.push('');
  }

  sections.push(formatList('Tasks', step.tasks));
  sections.push('');
  sections.push(formatList('Acceptance Criteria', step.acceptanceCriteria));
  sections.push('');

  if (step.files) {
    sections.push('## Files');
    sections.push(formatYamlBlock(step.files) ?? '- 없음');
    sections.push('');
  }

  sections.push(formatList('Verification', step.verification));
  sections.push('');

  sections.push('## Global Conventions');
  if (conventions.length === 0) {
    sections.push('- 없음');
  } else {
    for (const convention of conventions) {
      sections.push(`### ${convention.path}`);
      sections.push(convention.content.trim());
      sections.push('');
    }
  }

  sections.push('## Step References');
  if (references.loaded.length === 0) {
    sections.push('- 없음');
    sections.push('');
  } else {
    for (const reference of references.loaded) {
      sections.push(`### ${reference.path}`);

      if (reference.readable && reference.content !== null) {
        const fence = codeFenceForPath(reference.path);
        sections.push(`\`\`\`${fence}`);
        sections.push(reference.content.trim());
        sections.push('```');
      } else {
        sections.push('- Binary or non-text reference. Use the file path directly.');
      }

      sections.push('');
    }
  }

  if (references.missing.length > 0) {
    sections.push('## Missing Optional References');
    for (const reference of references.missing) {
      sections.push(`- ${reference.path}`);
    }
    sections.push('');
  }

  sections.push('## Execution Rules');
  sections.push('- Do not copy references blindly; adapt them to the current repository.');
  sections.push('- Do not write real secret values to files, issues, commits, or pull requests.');
  sections.push('- Record meaningful reference adjustments in the pull request body.');
  sections.push('- Keep the work scoped to this step.');

  return sections.join('\n').trimEnd();
}
