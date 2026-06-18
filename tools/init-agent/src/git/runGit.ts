import {execFile} from 'node:child_process';
import {promisify} from 'node:util';

const execFileAsync = promisify(execFile);

export type GitResult = {
  stdout: string;
  stderr: string;
};

export async function runGit(repoRoot: string, args: string[]): Promise<GitResult> {
  try {
    const {stdout, stderr} = await execFileAsync('git', args, {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 10,
    });

    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    };
  } catch (error) {
    if (error instanceof Error && 'stderr' in error) {
      const stderr = String((error as Error & {stderr?: unknown}).stderr ?? '').trim();
      const stdout = String((error as Error & {stdout?: unknown}).stdout ?? '').trim();
      throw new Error([`git ${args.join(' ')} failed`, stdout, stderr].filter(Boolean).join('\n'));
    }

    throw error;
  }
}

