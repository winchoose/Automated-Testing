import {readFile} from 'node:fs/promises';

export async function readTextFile(filePath: string) {
  return readFile(filePath, 'utf8');
}

export function isTextReference(referencePath: string) {
  return /\.(md|txt|yaml|yml|json|js|jsx|ts|tsx|css|scss|html)$/i.test(referencePath);
}

