# Code Convention

## Reference 적용 원칙

- `.init-agent/references`에 제공된 파일은 각 step에서 우선 참고한다.
- reference는 그대로 복사하는 고정 결과물이 아니라, 현재 프로젝트의 패키지 버전, 폴더 구조, 프레임워크 설정에 맞게 해석해서 적용한다.
- reference와 현재 프로젝트 상태가 충돌하면 현재 프로젝트가 정상 동작하도록 필요한 부분을 조정한다.
- 조정한 내용이 있다면 PR 본문에 어떤 부분을 왜 바꿨는지 기록한다.
- reference가 없는 경우에는 step yaml, conventions 문서, 현재 repo 상태를 기준으로 에이전트가 판단한다.
- 실제 값이 필요한 설정 파일은 reference 파일로 둘 수 있고, 배치 기준이나 네이밍 원칙처럼 설명이 중요한 내용은 Markdown 문서로 둘 수 있다.
