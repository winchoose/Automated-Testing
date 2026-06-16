# Router Reference

## 선택한 방식

- `react-router-dom`을 사용합니다.
- 라우터 생성 API는 `createBrowserRouter`를 사용합니다.
- route 정의는 객체 배열 형태로 작성합니다.
- 라우터 설정 파일은 `src/app/router/router.tsx`에 둡니다.
- 앱 연결은 `RouterProvider`를 사용합니다.

## 기본 예시

```tsx
import {createBrowserRouter} from 'react-router-dom';

import {HomePage} from '@/pages/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
]);
```

## 배치 규칙

- 라우터 설정은 `app` 레이어에 둡니다.
- 페이지 컴포넌트는 `pages` 레이어에서 import합니다.
- route path는 라우터 설정 파일에서 한 번에 확인할 수 있게 관리합니다.
- layout route가 필요해지면 `app/router` 또는 `widgets/layout` 구조와 함께 조정합니다.
