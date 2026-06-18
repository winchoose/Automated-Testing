import {exec} from 'node:child_process';
import {promisify} from 'node:util';

const execAsync = promisify(exec);

export type VerificationResult = {
  command: string;
  stdout: string;
  stderr: string;
};

export async function runVerification(repoRoot: string, commands: string[] = []) {
  const results: VerificationResult[] = [];

  for (const command of commands) {
    try {
      const {stdout, stderr} = await execAsync(command, {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 10,
      });

      results.push({
        command,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    } catch (error) {
      if (error instanceof Error && 'stderr' in error) {
        const stderr = String((error as Error & {stderr?: unknown}).stderr ?? '').trim();
        const stdout = String((error as Error & {stdout?: unknown}).stdout ?? '').trim();
        throw new Error([`Verification failed: ${command}`, stdout, stderr].filter(Boolean).join('\n'));
      }

      throw error;
    }
  }

  return results;
}

