# Environment Config Reference

## 기본 원칙

- 실제 환경변수 값은 repo에 커밋하지 않습니다.
- `.env.example`에는 필요한 변수 이름과 예시 값만 둡니다.
- Vite에서 클라이언트에 노출되는 값은 `VITE_` prefix를 사용합니다.
- secret token, API key, PAT는 GitHub Secrets 또는 Vercel Environment Variables에 직접 등록합니다.

## 로컬 환경변수

로컬 개발자는 `.env.example`을 참고해 `.env`를 직접 생성합니다.

```env
VITE_BASE_URL=https://api.example.com
```

## GitHub Secrets

아래 값은 GitHub repository secrets에 직접 등록합니다.

```text
PERSONAL_REPO_PAT
```

`PERSONAL_REPO_PAT`는 CD workflow가 Vercel에 연결된 개인 repo로 push할 때 사용합니다.

## Vercel Environment Variables

아래 값은 Vercel project environment variables에 직접 등록합니다.

```text
VITE_BASE_URL
```

production과 preview 환경 모두 필요한지 확인합니다.

## 금지 규칙

- `.env`를 커밋하지 않습니다.
- 실제 token 값을 `.env.example`에 넣지 않습니다.
- GitHub token, Vercel token, API key를 코드에 하드코딩하지 않습니다.
- 에이전트가 실제 secret 값을 생성하거나 추측하지 않습니다.
