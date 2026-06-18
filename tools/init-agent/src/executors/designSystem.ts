import type {StepExecutor} from './types.js';
import {mergeRecord, updatePackageJson, writeText} from './utils.js';

export const executeDesignSystem: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  changedFiles.push(
    await updatePackageJson(config.repoRoot, 'app/package.json', (packageJson) => ({
      ...packageJson,
      devDependencies: mergeRecord(packageJson.devDependencies, {
        tailwindcss: '^4.0.0',
      }),
    }))
  );
  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/src/shared/styles/global.css',
      `@import "tailwindcss";

:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111827;
  background: #f8fafc;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --color-primary: #2563eb;
  --color-surface: #ffffff;
  --color-text: #111827;
  --color-muted: #6b7280;
}

* {
  box-sizing: border-box;
}

html,
body,
#root {
  min-height: 100%;
  margin: 0;
}

body {
  min-width: 375px;
  max-width: 430px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--color-surface);
  color: var(--color-text);
}

button,
input,
textarea,
select {
  font: inherit;
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
import './shared/styles/global.css';

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
    message: 'Design system global CSS was configured.',
  };
};

