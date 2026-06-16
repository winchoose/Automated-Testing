# FSD Structure Reference

## 선택한 구조

Feature-Sliced Design 구조를 사용합니다.

## 기본 원칙

- `app`은 애플리케이션 초기화, 라우터, 전역 provider, 글로벌 설정을 담당합니다.
- `pages`는 실제 라우팅되는 페이지 단위를 담당합니다.
- `widgets`는 페이지를 구성하는 큰 UI 블록을 담당합니다.
- `features`는 사용자 행동 중심의 기능 단위를 담당합니다.
- `entities`는 비즈니스 도메인 엔터티를 담당합니다.
- `shared`는 프로젝트 전역에서 재사용 가능한 코드만 둡니다.

## 폴더 구조

```text
src/
│
├── app/ # 애플리케이션 초기화 및 글로벌 설정
│ ├── routes/ # 라우팅 설정
│ ├── providers/ # 애플리케이션 레벨에서 제공되는 프로바이더
│ │ ├── ThemeProvider.tsx # 테마 관련 프로바이더
│ │ ├── AuthProvider.tsx # 인증 관련 프로바이더
│ │ ├── index.ts # Provider Export
│ │ └── ... # 기타 전역 프로바이더들
│ └── ... # 다른 글로벌 설정들
│
├── pages/ # 페이지 컴포넌트
│ ├── HomePage/ # 홈 페이지
│ │ ├── ui/ # 홈 페이지 전용 하위 컴포넌트들
│ │ ├── hooks/ # 홈 페이지 전용 커스텀 훅
│ │ └── ... # 기타 필요한 리소스
│ ├── AboutPage/ # About 페이지
│ └── ...  
│
├── widgets/ # 위젯 컴포넌트 (페이지에서 사용하는 재사용 가능한 구성 요소)
│ ├── layout/ # 레이아웃 관련 위젯들
│ │ ├── Header/ # 헤더 위젯
│ │ │ ├── index.ts # 헤더 Export
│ │ │ ├── styles.css # 헤더 스타일
│ │ │ ├── Header.tsx # 헤더 컴포넌트
│ │ │ └── ...  
│ │ ├── Footer/ # 푸터 위젯
│ │ └── ...
│ └── ... # 다른 위젯들
│
├── features/ # 기능별로 구성된 폴더 (독립적인 비즈니스 로직과 UI 포함)
│ ├── UserAuth/ # 사용자 인증 기능
│ │ ├── api/ # 인증 관련 API 통신 모듈
│ │ ├── ui/ # 인증 관련 UI 컴포넌트
│ │ ├── model/ # 인증 관련 상태 관리
│ │ ├── types/ # 인증 관련 타입 정의 (TypeScript)
│ │ ├── utils/ # 인증 관련 유틸리티 함수
│ │ ├── index.ts # 모듈별로 export 정리
│ │ └── ... # 기타 필요한 리소스
│ ├── Cart/ # 장바구니 기능
│ │ ├── api/ # 장바구니 관련 API 통신 모듈
│ │ ├── ui/ # 장바구니 관련 UI 컴포넌트
│ │ ├── model/ # 장바구니 관련 상태 관리
│ │ ├── types/ # 장바구니 관련 타입 정의 (TypeScript)
│ │ ├── utils/ # 장바구니 관련 유틸리티 함수
│ │ ├── index.ts # 모듈별로 export 정리
│ │ └── ... # 기타 필요한 리소스
│ └── ...
│
├── entities/ # 엔터티 폴더 (도메인 모델, 상태 관리, API 통신 등)
│ ├── User/ # 사용자 엔터티
│ │ ├── model/ # 사용자 상태 관리
│ │ ├── api/ # 사용자 관련 API 모듈
│ │ ├── types/ # 사용자 관련 타입 정의 (TypeScript)
│ │ ├── index.ts # 모듈별로 export 정리
│ │ └── ...
│ ├── Product/ # 제품 엔터티
│ │ ├── model/ # 제품 상태 관리
│ │ ├── api/ # 제품 관련 API 모듈
│ │ ├── types/ # 제품 관련 타입 정의 (TypeScript)
│ │ ├── index.ts # 모듈별로 export 정리
│ │ └── ...
│ └── ...
│
├── shared/ # 공통 유틸리티, 컴포넌트, 훅 등
│ ├── utils/ # 유틸리티 함수
│ ├── hooks/ # 공통 커스텀 훅
│ ├── ui/ # 공통 컴포넌트 (Button, Input 등)
│ ├── styles/ # 공통 스타일 파일
│ ├── types/ # 공통 타입 정의 (TypeScript)
│ ├── index.ts # 모듈별로 export 정리
│ └── ...
└── ...
```

## Layer 역할

### app

앱 전체 실행에 필요한 설정을 둡니다.

예:

```text
router
providers
global styles
app-level config
```

### pages

라우팅 단위의 화면을 둡니다.  
페이지는 하위 layer의 widget, feature, entity, shared를 조합해 화면을 구성합니다.

예:

```text
pages/HomePage
pages/AboutPage
```

### widgets

페이지에서 반복적으로 사용되는 큰 UI 블록을 둡니다.  
Header, Footer, Sidebar, Layout처럼 페이지를 구성하는 덩어리가 여기에 해당합니다.

예:

```text
widgets/layout/Header
widgets/layout/Footer
```

### features

사용자 행동 중심의 기능을 둡니다.  
로그인, 장바구니 담기, 상품 검색, 주문 제출처럼 하나의 액션으로 설명할 수 있는 기능이 여기에 해당합니다.

예:

```text
features/UserAuth
features/Cart
```

### entities

비즈니스 도메인 모델을 둡니다.  
User, Product, Order처럼 프로젝트의 핵심 명사로 설명되는 대상이 여기에 해당합니다.

예:

```text
entities/User
entities/Product
```

### shared

도메인 지식이 없는 공통 코드를 둡니다.  
여러 layer에서 재사용 가능한 UI, utils, hooks, types, styles, api client가 여기에 해당합니다.

예:

```text
shared/ui
shared/utils
shared/api
shared/types
```

## 의존성 규칙

- `app`은 모든 layer를 사용할 수 있습니다.
- `pages`는 `widgets`, `features`, `entities`, `shared`를 사용할 수 있습니다.
- `widgets`는 `features`, `entities`, `shared`를 사용할 수 있습니다.
- `features`는 `entities`, `shared`를 사용할 수 있습니다.
- `entities`는 `shared`를 사용할 수 있습니다.
- `shared`는 다른 layer에 의존하지 않습니다.

## 금지 규칙

- `shared`에서 `entities`, `features`, `widgets`, `pages`, `app`을 import하지 않습니다.
- `entities`에서 `features`, `widgets`, `pages`, `app`을 import하지 않습니다.
- `features`에서 `widgets`, `pages`, `app`을 import하지 않습니다.
- 서로 다른 feature의 내부 구현을 직접 import하지 않습니다.
- 한 페이지에서만 쓰는 UI를 무리하게 `shared`로 올리지 않습니다.
- 특정 도메인 지식이 들어간 코드는 `shared`에 두지 않습니다.

## Public API 규칙

- 각 slice는 가능한 경우 `index.ts`를 통해 public API를 노출합니다.
- 외부 layer에서는 slice 내부 파일을 깊게 import하지 않고 `index.ts`를 통해 import합니다.
- 내부 구현 파일은 외부에서 직접 import하지 않습니다.

## 생성 시 주의사항

- 기존 `src/main.tsx`는 유지합니다.
- 기존 `src/App.tsx`가 있다면 `src/app` 레이어로 이동하거나 역할에 맞게 조정합니다.
- 빈 폴더만 필요한 경우 `.gitkeep` 또는 `README.md`를 둘 수 있습니다.
- 라우터 설정은 `app` 레이어에 둡니다.
- 공통 API client는 `shared/api`에 둡니다.
- 전역 스타일은 `shared/styles` 또는 `app` 초기화 영역에서 import합니다.
