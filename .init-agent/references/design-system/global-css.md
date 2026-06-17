# Global CSS Reference

global CSS에 반영할 reset, CSS variables, body 기본 스타일, 공통 base style 규칙을 작성합니다.

## 작성할 내용

- reset 또는 normalize 범위
- `:root`에 선언할 CSS variables
- body 기본 font-family
- body 기본 background-color
- body 기본 text color
- selection, button, input 등 기본 요소 스타일
- Tailwind를 사용할 경우 `@tailwind base`, `@tailwind components`, `@tailwind utilities` 배치

## 예시

```css
@import "tailwindcss";
@import "./color.css";
@import "./typography.css";

html,
body {
  width: 100%;
  font-size: 62.5%;
  scroll-behavior: smooth;
  scrollbar-width: none;
  background-color: var(--color-gray-300);
  font-family: Pretendard, system-ui, sans-serif;
}

::-webkit-scrollbar {
  display: none;
}

#root {
  width: 100%;
  min-width: 375px;
  max-width: 430px;
  min-height: 100dvh;
  margin: 0 auto;
  background-color: var(--color-white);
}

button {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
}
```
