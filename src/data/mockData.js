export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const mockCollections = [
  {
    id: 'col-1',
    name: 'User API',
    environmentId: 'env-dev',
    requests: [
      {
        id: 'req-1',
        name: 'List users',
        method: 'GET',
        url: '{{BASE_URL}}/users',
      },
      {
        id: 'req-2',
        name: 'Create user',
        method: 'POST',
        url: '{{BASE_URL}}/users',
      },
    ],
  },
  {
    id: 'col-2',
    name: 'Auth',
    environmentId: null,
    requests: [
      {
        id: 'req-3',
        name: 'Login',
        method: 'POST',
        url: '{{BASE_URL}}/auth/login',
      },
    ],
  },
];

export const mockEnvironments = [
  {
    id: 'env-dev',
    name: 'Development',
    variables: [
      { key: 'BASE_URL', value: 'http://localhost:3000/api' },
      { key: 'API_KEY', value: 'dev-key-123' },
    ],
  },
  {
    id: 'env-staging',
    name: 'Staging',
    variables: [
      { key: 'BASE_URL', value: 'https://staging.example.com/api' },
      { key: 'API_KEY', value: 'staging-key-456' },
    ],
  },
  {
    id: 'env-prod',
    name: 'Production',
    variables: [
      { key: 'BASE_URL', value: 'https://api.example.com' },
      { key: 'API_KEY', value: '' },
    ],
  },
];

export const mockActiveRequest = {
  method: 'GET',
  url: '{{BASE_URL}}/users',
  headers: [
    { key: 'Accept', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer {{API_KEY}}' },
  ],
  params: [
    { key: 'page', value: '1' },
    { key: 'limit', value: '10' },
  ],
  body: '{\n  "name": "Jane Doe",\n  "email": "jane@example.com"\n}',
};

export const mockResponse = {
  status: 200,
  statusText: 'OK',
  duration: 142,
  headers: {
    'content-type': 'application/json',
    'x-request-id': 'abc-123',
    'cache-control': 'no-cache',
  },
  body: {
    data: [
      { id: 1, name: 'Jane Doe', email: 'jane@example.com' },
      { id: 2, name: 'John Smith', email: 'john@example.com' },
    ],
    meta: { page: 1, limit: 10, total: 2 },
  },
};

export const mockHistory = [
  {
    id: 'hist-1',
    method: 'GET',
    url: 'http://localhost:3000/api/users?page=1',
    status: 200,
    timestamp: '2026-06-01T10:15:00.000Z',
    duration: 142,
    response: mockResponse,
  },
  {
    id: 'hist-2',
    method: 'POST',
    url: 'http://localhost:3000/api/users',
    status: 201,
    timestamp: '2026-06-01T09:42:00.000Z',
    duration: 318,
    response: {
      status: 201,
      statusText: 'Created',
      duration: 318,
      headers: { 'content-type': 'application/json' },
      body: { id: 3, name: 'New User', email: 'new@example.com' },
    },
  },
  {
    id: 'hist-3',
    method: 'POST',
    url: 'http://localhost:3000/api/auth/login',
    status: 401,
    timestamp: '2026-05-31T18:20:00.000Z',
    duration: 89,
    response: {
      status: 401,
      statusText: 'Unauthorized',
      duration: 89,
      headers: { 'content-type': 'application/json' },
      body: { error: 'Invalid credentials' },
    },
  },
];

export function createEmptyKeyValue() {
  return { key: '', value: '' };
}

export function cloneKeyValueRows(rows) {
  return rows.map((row) => ({ ...row }));
}
