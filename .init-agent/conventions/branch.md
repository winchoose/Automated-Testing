# Branch Convention

## 형식

```text
init/{short-description}/#{issue-number}
```

## 예시

```text
init/icon-svgr-setup/#27
init/react-setup/#2
init/tanstack-query-setup/#15
```

## 작성 규칙

- 초기세팅 작업 branch는 `init/` prefix를 사용합니다.
- description은 영어 kebab-case를 사용합니다.
- GitHub issue 번호가 있으면 마지막에 `/#번호`를 붙입니다.
- branch 이름은 작업 목적을 짧게 드러내야 합니다.

## 자동 생성 규칙

- step id를 기반으로 `{short-description}`을 생성합니다.
- issue 생성 후 issue number를 branch 이름에 반영합니다.
