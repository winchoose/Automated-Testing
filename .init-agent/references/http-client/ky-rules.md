# ky HTTP Client Reference

## 선택한 라이브러리

`ky`를 사용합니다.

## 기본 원칙

- API 요청은 공통 client를 통해 수행합니다.
- 컴포넌트 안에서 직접 `fetch` 또는 `ky` 인스턴스를 생성하지 않습니다.
- API 요청 함수와 TanStack Query hook은 분리합니다.
- API baseURL은 Vite 환경변수에서 읽습니다.

## 배치 규칙

- 공통 client는 `src/shared/api/client.ts`에 둡니다.
- 도메인별 API 요청 함수는 해당 도메인 또는 feature의 `api` 폴더에 둡니다.
- 공통 에러 타입이나 유틸은 `src/shared/api` 또는 `src/shared/types`에 둡니다.

## 환경변수

- baseURL 환경변수 이름은 `VITE_BASE_URL`을 사용합니다.
- 실제 값은 `.env`에만 두고, `.env.example`에는 예시 값만 둡니다.

## 기본 옵션

- timeout: 10000
- retry: 0
- throwHttpErrors: true

## 기본 client 예시

```ts
import ky from 'ky';

export const api = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  retry: 0,
});
```

## 에러 처리 규칙

- HTTP 에러는 공통 에러 형태로 정규화합니다.
- status code를 보존합니다.
- 가능한 경우 response body를 함께 보존합니다.
- 인증 token refresh는 MVP 범위에서는 포함하지 않습니다.

## 금지 규칙

- 컴포넌트에서 API endpoint 문자열을 직접 관리하지 않습니다.
- 서버 상태를 클라이언트 store에 중복 저장하지 않습니다.
- 인증 토큰이나 secret 값을 코드에 하드코딩하지 않습니다.
