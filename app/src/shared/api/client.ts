import ky from 'ky';

export const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_BASE_URL,
  retry: 0,
  timeout: 10_000,
});
