# Domain Structure Reference

## 선택한 구조

도메인 기반 구조를 사용합니다.

## 기본 원칙

- `src/app`은 앱 초기화, 라우터, 전역 provider를 둡니다.
- `src/pages`는 실제 라우팅되는 페이지 단위를 둡니다.
- 각 page/domain 폴더 안에는 해당 도메인에서만 쓰는 `api`, `components`, `hooks`를 둡니다.
- `src/shared`는 여러 도메인에서 재사용되는 코드만 둡니다.
- 특정 도메인에서만 쓰는 컴포넌트는 `shared`로 올리지 않습니다.

## 폴더 구조

```text
src/
├── main.tsx
├── app/
│   ├── router/
│   └── App.tsx
├── pages/
│   ├── home/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── HomePage.tsx
│   └── product/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       └── ProductDetailPage.tsx
└── shared/
    ├── api/
    ├── components/
    ├── hooks/
    ├── stores/
    ├── types/
    ├── utils/
    ├── constants/
    ├── styles/
    └── assets/
```
