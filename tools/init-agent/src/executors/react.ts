import type {StepExecutor} from './types.js';
import {writeText} from './utils.js';

export const executeReact: StepExecutor = async (config, step) => {
  const changedFiles = await Promise.all([
    writeText(
      config.repoRoot,
      'app/package.json',
      `{
  "name": "automated-testing-app",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}`
    ),
    writeText(
      config.repoRoot,
      'app/index.html',
      `<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>`
    ),
    writeText(
      config.repoRoot,
      'app/.gitignore',
      `node_modules
dist
.env
.env.*
!.env.example
`
    ),
    writeText(
      config.repoRoot,
      'app/tsconfig.json',
      `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}`
    ),
    writeText(
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
    "jsx": "react-jsx"
  },
  "include": ["src"]
}`
    ),
    writeText(
      config.repoRoot,
      'app/tsconfig.node.json',
      `{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}`
    ),
    writeText(
      config.repoRoot,
      'app/vite.config.ts',
      `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`
    ),
    writeText(
      config.repoRoot,
      'app/src/main.tsx',
      `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);`
    ),
    writeText(
      config.repoRoot,
      'app/src/vite-env.d.ts',
      `/// <reference types="vite/client" />`
    ),
    writeText(
      config.repoRoot,
      'app/src/App.tsx',
      `export default function App() {
  return (
    <main>
      <h1>Automated Testing</h1>
    </main>
  );
}`
    ),
  ]);

  return {
    stepId: step.id,
    changedFiles,
    message: 'React Vite TypeScript app was generated in app/.',
  };
};
