import type {LoadedAgentConfig} from '../config/loadAgentConfig.js';
import {pathExists, resolveReferencePath, resolveStepFilePath} from '../config/loadAgentConfig.js';

export type ValidationResult = {
  errors: string[];
  warnings: string[];
};

export async function validateWorkflow(config: LoadedAgentConfig): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const {repoRoot, workflow, state, steps} = config;
  const stepIds = new Set(steps.map((step) => step.id));
  const stateStepIds = new Set(Object.keys(state.steps));

  for (const workflowStep of workflow.steps) {
    if (!stepIds.has(workflowStep.id)) {
      errors.push(`workflow step '${workflowStep.id}' has no matching step config`);
    }

    const stepFilePath = resolveStepFilePath(repoRoot, workflowStep.file);
    if (!(await pathExists(stepFilePath))) {
      errors.push(`missing step file: ${workflowStep.file}`);
    }

    if (!stateStepIds.has(workflowStep.id)) {
      warnings.push(`state.yaml has no entry for step '${workflowStep.id}'`);
    }
  }

  for (const step of steps) {
    for (const dependency of step.dependsOn) {
      if (!stepIds.has(dependency)) {
        errors.push(`step '${step.id}' depends on unknown step '${dependency}'`);
      }
    }

    for (const reference of step.references ?? []) {
      const referencePath = resolveReferencePath(repoRoot, reference.path);
      const exists = await pathExists(referencePath);

      if (!exists && reference.required) {
        errors.push(`step '${step.id}' requires missing reference '${reference.path}'`);
      } else if (!exists) {
        warnings.push(`optional reference missing for step '${step.id}': ${reference.path}`);
      }
    }
  }

  return {errors, warnings};
}
