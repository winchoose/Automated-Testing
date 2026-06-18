# Automated-Testing
자동화 생성과 테스트를 위한 레포지토리

## Environment Variables

Create `app/.env` locally and set:

```env
VITE_BASE_URL=https://api.example.com
```

Do not commit real secret values.

## Deployment Secrets

Register this repository secret in GitHub before CD runs:

- `PERSONAL_REPO_PAT`: token used by GitHub Actions to push to the Vercel-connected deployment repository.
