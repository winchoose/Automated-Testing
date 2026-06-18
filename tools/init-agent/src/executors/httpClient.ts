import type {StepExecutor} from './types.js';
import {mergeRecord, readTextIfExists, updatePackageJson, writeText} from './utils.js';

export const executeHttpClient: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  changedFiles.push(
    await updatePackageJson(config.repoRoot, 'app/package.json', (packageJson) => ({
      ...packageJson,
      dependencies: mergeRecord(packageJson.dependencies, {
        ky: '^1.0.0',
      }),
    }))
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/shared/api/client.ts',
      `import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  retry: 0,
  timeout: 10_000,
});`
    )
  );
  changedFiles.push(await writeText(config.repoRoot, 'app/src/shared/api/index.ts', `export {apiClient} from './client';`));
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

Do not commit real secret values.
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
    message: 'HTTP client was configured with ky.',
  };
};
