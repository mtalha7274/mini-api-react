import { executeHttpRequest } from './index';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

test('executeHttpRequest routes GET to fetch with GET method', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    status: 200,
    statusText: 'OK',
    headers: {
      forEach(cb) {
        cb('application/json', 'content-type');
      },
      get: (name) => (name === 'content-type' ? 'application/json' : null),
    },
    json: async () => ({ ok: true }),
  });

  const result = await executeHttpRequest({
    method: 'GET',
    url: 'http://example.com/api',
    headers: [],
    params: [],
    envVariableMap: {},
  });

  expect(global.fetch).toHaveBeenCalledWith(
    'http://example.com/api',
    expect.objectContaining({ method: 'GET' })
  );
  expect(result.status).toBe(200);
  expect(result.body).toEqual({ ok: true });
});

test('executeHttpRequest routes POST with body', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    status: 201,
    statusText: 'Created',
    headers: {
      forEach(cb) {
        cb('text/plain', 'content-type');
      },
      get: () => 'text/plain',
    },
    text: async () => 'created',
  });

  await executeHttpRequest({
    method: 'POST',
    url: 'http://example.com/api',
    headers: [],
    params: [],
    body: '{"id":1}',
    envVariableMap: {},
  });

  expect(global.fetch).toHaveBeenCalledWith(
    'http://example.com/api',
    expect.objectContaining({
      method: 'POST',
      body: '{"id":1}',
    })
  );
});

test('executeHttpRequest returns error snapshot on network failure', async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error('Network down'));

  const result = await executeHttpRequest({
    method: 'GET',
    url: 'http://example.com/api',
    headers: [],
    params: [],
    envVariableMap: {},
  });

  expect(result.status).toBe(0);
  expect(result.statusText).toBe('Error');
  expect(result.body).toEqual({ message: 'Network down' });
});
