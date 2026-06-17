# SVGR Icon Reference

## 선택한 방식

SVGR을 사용해 SVG 원본 파일을 React 아이콘 컴포넌트로 변환합니다.

## 사용 방법

1. 새로운 아이콘 추가

   `src/shared/assets/svg` 폴더에 `.svg` 파일을 추가합니다.

2. 아이콘 빌드

   터미널에서 아래 명령어를 실행합니다.

   ```bash
   pnpm build:icons
   ```

3. 컴포넌트 사용

   `src/shared/icons`에 생성된 아이콘 컴포넌트를 가져와 사용합니다.

   ```tsx
   import {SearchIcon} from '@/shared/icons';

   export function SearchButton() {
     return <SearchIcon aria-hidden />;
   }
   ```

## 배치 규칙

- SVG 원본 파일은 `src/shared/assets/svg`에 둡니다.
- 생성된 React 아이콘 컴포넌트는 `src/shared/icons`에 둡니다.
- 여러 곳에서 사용하는 아이콘은 `src/shared/icons`에서 export합니다.
- 도메인 전용 아이콘이라도 원본 SVG는 `src/shared/assets/svg`에서 관리합니다.

## 네이밍 규칙

- SVG 파일명은 kebab-case를 사용합니다.
- 생성된 React 컴포넌트는 PascalCase에 `IcSvg` prefix를 붙입니다.
- 생성된 파일명은 `ic-` prefix와 kebab-case를 사용합니다.

예:

```text
search.svg -> ic-search.tsx / IcSvgSearch
arrow-left.svg -> ic-arrow-left.tsx / IcSvgArrowLeft
```

## 빌드 스크립트 규칙

- 아이콘 빌드는 `scripts/build-icons.ts`에서 관리합니다.
- `pnpm build:icons`는 `scripts/build-icons.ts`를 실행합니다.
- 생성된 파일의 stroke/fill 색상은 가능한 경우 `currentColor`로 변환합니다.
- 생성된 `src/shared/icons/index.ts`에는 named export를 생성합니다.

## 금지 규칙

- 컴포넌트 안에 긴 inline svg를 직접 작성하지 않습니다.
- 같은 SVG를 여러 컴포넌트 파일에 중복 복사하지 않습니다.
- 생성된 아이콘 파일을 수동으로 수정하지 않습니다. 수정이 필요하면 SVG 원본 또는 SVGR 설정을 변경합니다.
