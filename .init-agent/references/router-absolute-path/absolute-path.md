# Absolute Path Reference

## 선택한 alias

- alias는 `@`를 사용합니다.
- `@`는 `src` 디렉터리를 가리킵니다.

## 설정 위치

- Vite alias는 `vite.config.ts`에 설정합니다.
- TypeScript paths alias는 `tsconfig.app.json` 또는 프로젝트 구조에 맞는 tsconfig 파일에 설정합니다.

## 예시

```ts
// vite.config.ts
import path from 'node:path';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 사용 규칙

- `src` 내부 모듈은 `@` alias로 import할 수 있습니다.
- 깊은 상대경로가 길어지는 경우 alias를 우선 사용합니다.
- 같은 폴더나 바로 옆 파일 import는 상대경로를 사용해도 됩니다.
