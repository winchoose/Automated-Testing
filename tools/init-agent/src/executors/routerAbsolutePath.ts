import type {StepExecutor} from './types.js';
import {mergeRecord, updatePackageJson, writeText} from './utils.js';

export const executeRouterAbsolutePath: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  changedFiles.push(
    await updatePackageJson(config.repoRoot, 'app/package.json', (packageJson) => ({
      ...packageJson,
      dependencies: mergeRecord(packageJson.dependencies, {
        'react-router-dom': '^7.0.0',
      }),
      devDependencies: mergeRecord(packageJson.devDependencies, {
        '@types/node': '^22.0.0',
      }),
    }))
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/vite.config.ts',
      `import path from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});`
    )
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/tsconfig.app.json',
      `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}`
    )
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/app/router/router.tsx',
      `import {createBrowserRouter} from 'react-router-dom';
import {HomePage} from '@/pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);`
    )
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/app/App.tsx',
      `import {RouterProvider} from 'react-router-dom';
import {router} from './router/router';

export default function App() {
  return <RouterProvider router={router} />;
}`
    )
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/main.tsx',
      `import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './app/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`
    )
  );

  return {
    stepId: step.id,
    changedFiles,
    message: 'React Router and @ alias were configured.',
  };
};

