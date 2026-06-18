import type {StepExecutor} from './types.js';
import {readTextIfExists, writeText} from './utils.js';

export const executeEnvConfig: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/.env.example',
      `VITE_BASE_URL=https://api.example.com`
    )
  );

  const gitignore = (await readTextIfExists(config.repoRoot, '.gitignore')) ?? '';
  const gitignoreLines = new Set(gitignore.split(/\r?\n/).filter(Boolean));
  for (const line of ['app/.env', 'app/.env.local', 'app/.env.*.local']) {
    gitignoreLines.add(line);
  }
  changedFiles.push(await writeText(config.repoRoot, '.gitignore', [...gitignoreLines].join('\n')));

  const readme = (await readTextIfExists(config.repoRoot, 'README.md')) ?? '# Automated-Testing\n';
  const envSection = `## Environment Variables

Create \`app/.env\` locally and set:

\`\`\`env
VITE_BASE_URL=https://api.example.com
\`\`\`

Do not commit real secret values. GitHub Actions CD requires the \`PERSONAL_REPO_PAT\` repository secret.
`;
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'README.md',
      readme.includes('## Environment Variables') ? readme : `${readme.trimEnd()}\n\n${envSection}`
    )
  );

  return {
    stepId: step.id,
    changedFiles,
    message: 'Environment example and documentation were configured.',
  };
};

