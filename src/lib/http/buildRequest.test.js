import { buildHeaders, mergeQueryParams, buildRequest } from './buildRequest';

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
