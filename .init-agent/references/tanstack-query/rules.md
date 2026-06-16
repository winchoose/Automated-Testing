# TanStack Query Reference

## 선택한 라이브러리

TanStack Query를 사용합니다.

## 기본 원칙

- 서버 상태 관리는 TanStack Query로 관리합니다.
- 전역 클라이언트 상태와 서버 상태를 분리합니다.
- API 요청 함수와 query hook은 분리합니다.
- query key는 배열 형태로 관리합니다.

## 배치 규칙

- QueryClient 생성은 `src/app/providers`에 둡니다.
- QueryClientProvider는 앱 provider 계층에서 감쌉니다.
- query hook은 해당 도메인 또는 feature의 `hooks` 또는 `api` 근처에 둡니다.
- 공통 query 유틸은 `src/shared`에 둡니다.

## 기본 옵션

- staleTime: 60초
- gcTime: 5분
- retry: 1
- refetchOnWindowFocus: false

## Query Key 규칙

- query key는 배열로 작성합니다.
- 첫 번째 값은 도메인 이름을 사용합니다.

예:

```ts
['products'];
['products', productId];
['cart'];
```

## 금지 규칙

- 컴포넌트 안에서 fetch 함수를 직접 작성하지 않습니다.
- query key를 문자열 하나로만 관리하지 않습니다.
- 서버 상태를 클라이언트 store에 중복 저장하지 않습니다.
- API 요청 함수와 query hook을 하나의 컴포넌트 안에 섞어 작성하지 않습니다.
