import type {StepExecutor} from './types.js';
import {ensureDir, writeText} from './utils.js';

const directories = [
  'app/src/app',
  'app/src/pages/home',
  'app/src/domains',
  'app/src/shared/components',
  'app/src/shared/lib',
  'app/src/shared/api',
  'app/src/shared/assets',
  'app/src/shared/styles',
];

export const executeFolderStructure: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  for (const directory of directories) {
    changedFiles.push(await ensureDir(config.repoRoot, directory));
  }

  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/pages/home/HomePage.tsx',
      `export function HomePage() {
  return (
    <main>
      <h1>Automated Testing</h1>
    </main>
  );
}`
    )
  );
  changedFiles.push(await writeText(config.repoRoot, 'app/src/pages/home/index.ts', `export {HomePage} from './HomePage';`));
  changedFiles.push(await writeText(config.repoRoot, 'app/src/shared/lib/index.ts', `export {};`));
  changedFiles.push(await writeText(config.repoRoot, 'app/src/shared/api/index.ts', `export {};`));

  return {
    stepId: step.id,
    changedFiles,
    message: 'Domain-oriented app/src folder structure was generated.',
  };
};

