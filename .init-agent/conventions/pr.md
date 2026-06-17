# Pull Request Convention

## 제목 형식

```text
Init: {작업명}
```

## 예시

```text
Init: color, font 시스템 세팅 및 global css 세팅
Init: Tanstack Query 세팅
Init: SVGR 아이콘 세팅
```

## 본문 구성

PR 본문에는 아래 내용을 포함합니다.

```text
ISSUE
What is this PR?
Screenshot
Test Checklist
참고 자료
```

## 작성 규칙

- 초기세팅 PR은 `Init:` prefix를 사용합니다.
- 관련 issue가 있으면 `close #이슈번호`를 포함합니다.
- 실행한 검증 명령어를 Test Checklist에 기록합니다.
- reference를 수정해 적용한 경우, 조정한 내용을 PR 본문에 기록합니다.
- 실제 secret 값은 PR에 작성하지 않습니다.
