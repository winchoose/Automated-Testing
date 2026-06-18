import path from 'node:path';
import type {StepConfig} from '../config/types.js';
import {pathExists, resolveReferencePath} from '../config/loadAgentConfig.js';
import {isTextReference, readTextFile} from './readTextFile.js';

export type LoadedReference = {
  path: string;
  type?: string;
  required: boolean;
  readable: boolean;
  content: string | null;
};

export type MissingReference = {
  path: string;
  required: boolean;
};

export async function loadReferences(repoRoot: string, step: StepConfig) {
  const loaded: LoadedReference[] = [];
  const missing: MissingReference[] = [];

  for (const reference of step.references ?? []) {
    const referencePath = resolveReferencePath(repoRoot, reference.path);
    const exists = await pathExists(referencePath);
    const required = reference.required ?? false;

    if (!exists) {
      missing.push({path: reference.path, required});
      continue;
    }

    const readable = isTextReference(reference.path);
    loaded.push({
      path: reference.path,
      type: reference.type,
      required,
      readable,
      content: readable ? await readTextFile(referencePath) : null,
    });
  }

  const requiredMissing = missing.filter((reference) => reference.required);
  if (requiredMissing.length > 0) {
    throw new Error(
      `Missing required references: ${requiredMissing
        .map((reference) => reference.path)
        .join(', ')}`
    );
  }

  return {
    loaded,
    missing,
    basePath: path.relative(repoRoot, resolveReferencePath(repoRoot, '')),
  };
}

