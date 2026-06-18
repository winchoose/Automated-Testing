# Automated-Testing
자동화 생성과 테스트를 위한 레포지토리

## Environment Variables

Create `app/.env` locally and set:

```env
VITE_BASE_URL=https://api.example.com
```

Do not commit real secret values. GitHub Actions CD requires the `PERSONAL_REPO_PAT` repository secret.
