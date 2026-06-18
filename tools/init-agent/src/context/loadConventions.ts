import path from 'node:path';
import {readdir} from 'node:fs/promises';
import {pathExists} from '../config/loadAgentConfig.js';
import {resolveAgentPath} from '../utils/paths.js';
import {readTextFile} from './readTextFile.js';

export type LoadedConvention = {
  name: string;
  path: string;
  content: string;
};

export async function loadConventions(repoRoot: string) {
  const conventionsDirectory = resolveAgentPath(repoRoot, 'conventions');

  if (!(await pathExists(conventionsDirectory))) {
    return [];
  }

  const fileNames = (await readdir(conventionsDirectory))
    .filter((fileName) => fileName.endsWith('.md'))
    .sort();

  return Promise.all(
    fileNames.map(async (fileName): Promise<LoadedConvention> => {
      const conventionPath = path.join(conventionsDirectory, fileName);

      return {
        name: fileName.replace(/\.md$/, ''),
        path: path.relative(resolveAgentPath(repoRoot), conventionPath),
        content: await readTextFile(conventionPath),
      };
    })
  );
}

