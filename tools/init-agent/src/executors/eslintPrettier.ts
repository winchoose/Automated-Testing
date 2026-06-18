import type {StepExecutor} from './types.js';
import {mergeRecord, updatePackageJson, writeText} from './utils.js';

export const executeEslintPrettier: StepExecutor = async (config, step) => {
  const changedFiles: string[] = [];

  changedFiles.push(
    await writeText(
      config.repoRoot,
      'app/eslint.config.js',
      `import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'jsx-a11y/alt-text': 'warn',
    },
  },
);`
    )
  );
  changedFiles.push(await writeText(config.repoRoot, 'app/.prettierrc', `{ "singleQuote": true, "semi": true }`));
  changedFiles.push(await writeText(config.repoRoot, 'app/.prettierignore', `dist
node_modules
coverage
`));
  changedFiles.push(
    await updatePackageJson(config.repoRoot, 'app/package.json', (packageJson) => ({
      ...packageJson,
      scripts: {
        ...(packageJson.scripts ?? {}),
        lint: 'eslint .',
        'lint:fix': 'eslint . --fix',
        format: 'prettier . --write',
        'format:check': 'prettier . --check',
      },
      devDependencies: mergeRecord(packageJson.devDependencies, {
        eslint: '^9.0.0',
        prettier: '^3.0.0',
        'typescript-eslint': '^8.0.0',
        '@eslint/js': '^9.0.0',
        'eslint-config-prettier': '^10.0.0',
        'eslint-plugin-react': '^7.0.0',
        'eslint-plugin-react-hooks': '^5.0.0',
        'eslint-plugin-react-refresh': '^0.4.0',
        'eslint-plugin-jsx-a11y': '^6.0.0',
        globals: '^16.0.0',
        'prettier-plugin-tailwindcss': '^0.6.0',
      }),
    }))
  );

  return {
    stepId: step.id,
    changedFiles,
    message: 'ESLint and Prettier were configured for app/.',
  };
};
