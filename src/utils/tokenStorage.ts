const ACCESS_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  set: (token: string) => localStorage.setItem(ACCESS_KEY, token),
  setTokens: (token: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_KEY, token);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
