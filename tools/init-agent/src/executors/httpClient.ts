import type {StepExecutor} from './types.js';
import {mergeRecord, updatePackageJson, writeText} from './utils.js';

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

  return {
    stepId: step.id,
    changedFiles,
    message: 'HTTP client was configured with ky.',
  };
};

