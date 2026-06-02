import { buildHeaders, mergeQueryParams, buildRequest, mergeAuthHeaders } from './buildRequest';

test('buildHeaders resolves env variables and skips empty keys', () => {
  const headers = buildHeaders(
    [
      { key: 'Authorization', value: 'Bearer {{API_KEY}}' },
      { key: '', value: 'skip' },
    ],
    { API_KEY: 'secret' }
  );
  expect(headers).toEqual({ Authorization: 'Bearer secret' });
});

test('mergeQueryParams appends resolved query string', () => {
  const url = mergeQueryParams(
    '{{BASE}}/users',
    [{ key: 'page', value: '1' }],
    { BASE: 'http://api.test' }
  );
  expect(url).toBe('http://api.test/users?page=1');
});

test('buildRequest adds JSON content-type for POST body', () => {
  const built = buildRequest({
    method: 'POST',
    url: 'http://api.test/users',
    headers: [],
    params: [],
    body: '{"name":"a"}',
    envVariableMap: {},
  });
  expect(built.headers['Content-Type']).toBe('application/json');
  expect(built.body).toBe('{"name":"a"}');
});

test('buildRequest omits body for GET', () => {
  const built = buildRequest({
    method: 'GET',
    url: 'http://api.test/users',
    headers: [],
    params: [],
    body: '{"ignored":true}',
    envVariableMap: {},
  });
  expect(built.body).toBeUndefined();
});

test('mergeAuthHeaders injects Bearer token from collection auth', () => {
  const headers = mergeAuthHeaders(
    { Accept: 'application/json' },
    { type: 'bearer', token: 'my-token' },
    { mode: 'inherit', type: 'none', token: '' },
    {}
  );
  expect(headers).toEqual({
    Accept: 'application/json',
    Authorization: 'Bearer my-token',
  });
});

test('mergeAuthHeaders resolves env variables in token', () => {
  const headers = mergeAuthHeaders(
    {},
    { type: 'bearer', token: '{{API_KEY}}' },
    { mode: 'inherit', type: 'none', token: '' },
    { API_KEY: 'secret' }
  );
  expect(headers.Authorization).toBe('Bearer secret');
});

test('mergeAuthHeaders uses request override over collection auth', () => {
  const headers = mergeAuthHeaders(
    {},
    { type: 'bearer', token: 'col' },
    { mode: 'override', type: 'bearer', token: 'req' },
    {}
  );
  expect(headers.Authorization).toBe('Bearer req');
});

test('mergeAuthHeaders replaces manual Authorization header', () => {
  const headers = mergeAuthHeaders(
    { Authorization: 'Bearer old' },
    { type: 'bearer', token: 'new' },
    { mode: 'inherit', type: 'none', token: '' },
    {}
  );
  expect(headers).toEqual({ Authorization: 'Bearer new' });
});

test('mergeAuthHeaders skips header when type is none', () => {
  const headers = mergeAuthHeaders(
    { Accept: 'application/json' },
    { type: 'none', token: '' },
    { mode: 'inherit', type: 'none', token: '' },
    {}
  );
  expect(headers).toEqual({ Accept: 'application/json' });
});

test('buildRequest applies collection bearer auth', () => {
  const built = buildRequest({
    method: 'GET',
    url: 'http://api.test/users',
    headers: [{ key: 'Authorization', value: 'Bearer manual' }],
    params: [],
    body: '',
    envVariableMap: {},
    collectionAuth: { type: 'bearer', token: 'from-auth-tab' },
    requestAuth: { mode: 'inherit', type: 'none', token: '' },
  });
  expect(built.headers.Authorization).toBe('Bearer from-auth-tab');
});
