import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SVG_DIR = path.resolve('src/shared/assets/svg');
const ICONS_DIR = path.resolve('src/shared/icons');
const OUT_FILE = path.join(ICONS_DIR, 'index.ts');

function getIconName(name: string) {
  return name.replace(/\.[^.]+$/, '').replace(/^Ic(?=[A-Z])/, '');
}

function toPascalCase(name: string) {
  const pascalName = getIconName(name)
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
    .join('');
  return `IcSvg${pascalName}`;
}

function toFileName(name: string) {
  const snakeName = getIconName(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((value) => value.toLowerCase())
    .join('-');
  return `ic-${snakeName}.tsx`;
}

async function main() {
  await fs.mkdir(SVG_DIR, { recursive: true });
  await fs.rm(ICONS_DIR, { recursive: true, force: true });
  await fs.mkdir(ICONS_DIR, { recursive: true });

  const svgFiles = (await fs.readdir(SVG_DIR)).filter((file) =>
    file.endsWith('.svg'),
  );

  if (svgFiles.length === 0) {
    await fs.writeFile(OUT_FILE, '// (auto-generated) No icons yet.\n', 'utf8');
    return;
  }

  execSync(
    `pnpm exec svgr ${SVG_DIR} --out-dir ${ICONS_DIR} --ext tsx --typescript --no-dimensions --icon --no-index --jsx-runtime automatic --no-prettier`,
    { stdio: 'inherit' },
  );

  const generatedFiles = (await fs.readdir(ICONS_DIR)).filter(
    (file) => file.endsWith('.tsx') && !file.startsWith('index'),
  );
  const exportLines = [
    '// (auto-generated) Do not edit manually.',
    '// Run `pnpm build:icons` to regenerate.\n',
  ];

  for (const file of generatedFiles) {
    const oldPath = path.join(ICONS_DIR, file);
    const newFileName = toFileName(file);
    const newPath = path.join(ICONS_DIR, newFileName);
    const componentName = toPascalCase(file);

    await fs.rename(oldPath, newPath);
    let content = await fs.readFile(newPath, 'utf8');
    content = content.replace(
      /(stroke)=['"]([^'"]+)['"]/g,
      '$1="currentColor"',
    );
    content = content.replace(
      /(<path[^>]*?|<g[^>]*?)fill=['"]([^'"]+?)['"]/g,
      (match, start, fillValue) => {
        if (
          fillValue === 'none' ||
          fillValue === 'transparent' ||
          fillValue.startsWith('url(')
        ) {
          return match;
        }
        return `${start}fill="currentColor"`;
      },
    );
    content = content.replace(/^import \* as React from 'react';\r?\n/m, '');
    content = content.replace(/const Svg[^ ]+ =/, `const ${componentName} =`);
    content = content.replace(
      /export default Svg[^;]+;/,
      `export default ${componentName};`,
    );
    await fs.writeFile(newPath, content, 'utf8');
    exportLines.push(
      `export {default as ${componentName}} from './${newFileName.replace('.tsx', '')}';`,
    );
  }

  exportLines.push('');
  await fs.writeFile(OUT_FILE, exportLines.join('\n'), 'utf8');
  execSync(`pnpm exec prettier ${ICONS_DIR} --write`, { stdio: 'inherit' });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
