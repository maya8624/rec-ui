import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from './apiClient';
import { tokenStorage } from '../utils/tokenStorage';

vi.mock('../lib/queryClient', () => ({
  queryClient: { setQueryData: vi.fn() },
}));

describe('apiClient response interceptor — token refresh', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    localStorage.clear();
    vi.stubGlobal('location', { href: '' });
  });

  afterEach(() => {
    mock.restore();
  });

  it('retries the original request with the new token after a successful refresh', async () => {
    tokenStorage.setTokens('old-access', 'valid-refresh');

    mock.onPost('/auth/refresh').replyOnce(200, { token: 'new-access', refreshToken: 'new-refresh' });
    mock.onGet('/protected').replyOnce(401);
    mock.onGet('/protected').reply(200, { ok: true });

    const response = await api.get('/protected');

    expect(response.data).toEqual({ ok: true });
    expect(tokenStorage.get()).toBe('new-access');
    expect(tokenStorage.getRefreshToken()).toBe('new-refresh');
  });

  it('attaches the new token as the Authorization header on the retried request', async () => {
    tokenStorage.setTokens('old-access', 'valid-refresh');

    mock.onPost('/auth/refresh').replyOnce(200, { token: 'new-access', refreshToken: 'new-refresh' });
    mock.onGet('/protected').replyOnce(401);
    mock.onGet('/protected').reply(200, {});

    await api.get('/protected');

    const retried = mock.history.get[1];
    expect(retried.headers?.Authorization).toBe('Bearer new-access');
  });

  it('redirects to /login and clears tokens when no refresh token is stored', async () => {
    localStorage.clear();
    mock.onGet('/protected').reply(401);

    await expect(api.get('/protected')).rejects.toThrow();

    expect(window.location.href).toBe('/login');
    expect(tokenStorage.get()).toBeNull();
  });

  it('redirects to /login and clears tokens when the refresh call itself fails', async () => {
    tokenStorage.setTokens('old-access', 'bad-refresh');

    mock.onGet('/protected').reply(401);
    mock.onPost('/auth/refresh').reply(401);

    await expect(api.get('/protected')).rejects.toThrow();

    expect(window.location.href).toBe('/login');
    expect(tokenStorage.get()).toBeNull();
  });

  it('does not attempt refresh when the refresh endpoint itself returns 401', async () => {
    tokenStorage.setTokens('old-access', 'valid-refresh');
    mock.onPost('/auth/refresh').reply(401);
    mock.onGet('/protected').reply(401);

    await expect(api.get('/protected')).rejects.toThrow();

    expect(mock.history.post.filter((r) => r.url === '/auth/refresh')).toHaveLength(1);
    expect(window.location.href).toBe('/login');
  });

  it('attempts refresh for /auth/me when the access token is expired', async () => {
    tokenStorage.setTokens('old-access', 'valid-refresh');

    mock.onGet('/auth/me').replyOnce(401);
    mock.onPost('/auth/refresh').replyOnce(200, { token: 'new-access', refreshToken: 'new-refresh' });
    mock.onGet('/auth/me').reply(200, { id: '1', email: 'user@example.com' });

    const response = await api.get('/auth/me');

    expect(response.data).toEqual({ id: '1', email: 'user@example.com' });
    expect(tokenStorage.get()).toBe('new-access');
  });

  it('passes non-401 errors through without attempting refresh', async () => {
    tokenStorage.setTokens('old-access', 'valid-refresh');
    mock.onGet('/protected').reply(500);

    await expect(api.get('/protected')).rejects.toThrow();

    expect(mock.history.post.filter((r) => r.url === '/auth/refresh')).toHaveLength(0);
  });
});
