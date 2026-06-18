import type {StepExecutor} from './types.js';
import {writeText} from './utils.js';

export const executeCiCd: StepExecutor = async (config, step) => {
  const changedFiles = await Promise.all([
    writeText(
      config.repoRoot,
      '.github/workflows/ci.yml',
      `name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  quality:
    name: Quality Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
          cache-dependency-path: app/pnpm-lock.yaml

      - name: Install dependencies
        working-directory: app
        run: pnpm install --frozen-lockfile

      - name: Check formatting
        working-directory: app
        run: pnpm format:check

      - name: Lint
        working-directory: app
        run: pnpm lint

      - name: Build
        working-directory: app
        run: pnpm build`
    ),
    writeText(
      config.repoRoot,
      '.github/workflows/cd.yml',
      `name: Sync to personal repo

on:
  push:
    branches: [main, develop]
  workflow_dispatch:

concurrency:
  group: sync-fork-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  mirror:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false

      - name: Push to personal repo
        run: |
          git push https://x-access-token:\${{ secrets.PERSONAL_REPO_PAT }}@github.com/Automated-Testing-taek/Automated-Testing.git \${{ github.ref_name }} --force`
    ),
    writeText(
      config.repoRoot,
      'vercel.json',
      `{
  "framework": "vite",
  "buildCommand": "pnpm --dir app build",
  "installCommand": "pnpm --dir app install --frozen-lockfile",
  "outputDirectory": "app/dist"
}`
    ),
  ]);

  return {
    stepId: step.id,
    changedFiles,
    message: 'CI/CD workflows and Vercel config were generated.',
  };
};

