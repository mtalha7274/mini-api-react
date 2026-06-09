import {
  loadCollections,
  saveCollections,
  loadEnvironments,
  saveEnvironments,
  normalizeRequest,
} from './appStorage';

beforeEach(() => {
  localStorage.clear();
});

test('loadCollections returns empty when nothing stored', () => {
  expect(loadCollections()).toEqual({ collections: [] });
});

test('saveCollections and loadCollections round-trip', () => {
  const collections = [
    {
      id: 'col-1',
      name: 'API',
      environmentId: null,
      requests: [
        {
          id: 'req-1',
          name: 'Get',
          method: 'GET',
          url: 'http://test.com',
          headers: [{ key: 'Accept', value: 'json' }],
          params: [{ key: '', value: '' }],
          body: '',
        },
      ],
    },
  ];

  saveCollections(collections);
  const loaded = loadCollections();
  expect(loaded.collections[0].auth).toEqual({ type: 'none', token: '' });
  expect(loaded.collections[0].requests[0].auth).toEqual({
    mode: 'inherit',
    type: 'none',
    token: '',
  });
  expect(loaded.collections[0].id).toBe('col-1');
  expect(loaded.collections[0].requests[0].url).toBe('http://test.com');
});

test('normalizeRequest fills missing editor fields', () => {
  const req = normalizeRequest({
    id: 'req-1',
    name: 'Legacy',
    method: 'POST',
    url: '/x',
  });

  expect(req.headers).toHaveLength(1);
  expect(req.params).toHaveLength(1);
  expect(req.body).toBe('');
  expect(req.auth).toEqual({
    mode: 'inherit',
    type: 'none',
    token: '',
  });
});

test('loadEnvironments returns empty when nothing stored', () => {
  expect(loadEnvironments()).toEqual({ environments: [] });
});

test('saveEnvironments and loadEnvironments round-trip', () => {
  const environments = [
    {
      id: 'env-1',
      name: 'Dev',
      variables: [{ key: 'BASE_URL', value: 'http://localhost' }],
    },
  ];

  saveEnvironments(environments);
  expect(loadEnvironments()).toEqual({ environments });
});
