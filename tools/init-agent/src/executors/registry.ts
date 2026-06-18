import type {StepExecutor} from './types.js';
import {executeCiCd} from './ciCd.js';
import {executeDesignSystem} from './designSystem.js';
import {executeEslintPrettier} from './eslintPrettier.js';
import {executeFolderStructure} from './folderStructure.js';
import {executeHttpClient} from './httpClient.js';
import {executeIssuePrTemplate} from './issuePrTemplate.js';
import {executeReact} from './react.js';
import {executeRouterAbsolutePath} from './routerAbsolutePath.js';
import {executeSvgr} from './svgr.js';
import {executeTanstackQuery} from './tanstackQuery.js';

const executors = new Map<string, StepExecutor>([
  ['issue-pr-template', executeIssuePrTemplate],
  ['react', executeReact],
  ['eslint-prettier', executeEslintPrettier],
  ['ci-cd', executeCiCd],
  ['folder-structure', executeFolderStructure],
  ['router-absolute-path', executeRouterAbsolutePath],
  ['tanstack-query', executeTanstackQuery],
  ['http-client', executeHttpClient],
  ['svgr', executeSvgr],
  ['design-system', executeDesignSystem],
]);

export function getStepExecutor(stepId: string) {
  return executors.get(stepId) ?? null;
}

export function hasStepExecutor(stepId: string) {
  return executors.has(stepId);
}

export function listExecutableStepIds() {
  return [...executors.keys()];
}
