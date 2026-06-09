import {
  serializeCollection,
  slugifyCollectionName,
} from './collectionExport';

test('serializeCollection pretty-prints full collection shape', () => {
  const collection = {
    id: 'col-1',
    name: 'User API',
    environmentId: 'env-1',
    auth: { type: 'bearer', token: '{{API_KEY}}' },
    requests: [
      {
        id: 'req-1',
        name: 'List users',
        method: 'GET',
        url: '/users',
        headers: [{ key: 'Accept', value: 'json' }],
        params: [{ key: '', value: '' }],
        body: '',
        auth: { mode: 'inherit', type: 'none', token: '' },
      },
    ],
  };

  const parsed = JSON.parse(serializeCollection(collection));
  expect(parsed).toEqual(collection);
});

test('slugifyCollectionName produces safe filenames', () => {
  expect(slugifyCollectionName('User API')).toBe('user-api');
  expect(slugifyCollectionName('  ')).toBe('collection');
});
