import type {StepExecutor} from './types.js';
import {mergeRecord, updatePackageJson, writeText} from './utils.js';

export const executeTanstackQuery: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  changedFiles.push(
    await updatePackageJson(config.repoRoot, 'app/package.json', (packageJson) => ({
      ...packageJson,
      dependencies: mergeRecord(packageJson.dependencies, {
        '@tanstack/react-query': '^5.0.0',
      }),
      devDependencies: mergeRecord(packageJson.devDependencies, {
        '@tanstack/react-query-devtools': '^5.0.0',
      }),
    }))
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/app/providers/query-client.ts',
      `import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 300_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});`
    )
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/app/providers/query-provider.tsx',
      `import type {PropsWithChildren} from 'react';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {queryClient} from './query-client';

export function QueryProvider({children}: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}`
    )
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/app/App.tsx',
      `import {RouterProvider} from 'react-router-dom';
import {QueryProvider} from './providers/query-provider';
import {router} from './router/router';

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}`
    )
  );

  return {
    stepId: step.id,
    changedFiles,
    message: 'TanStack Query provider was configured.',
  };
};

