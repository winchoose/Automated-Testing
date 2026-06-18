import {readFile} from 'node:fs/promises';
import YAML from 'yaml';

export async function loadYamlFile<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, 'utf8');
  return YAML.parse(content) as T;
}
