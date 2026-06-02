import {
  collectionReducer,
  duplicateRequest,
} from './collectionReducer';

const initialState = { collections: [] };

function makeRequest(id, name, url = '') {
  return {
    id,
    name,
    method: 'GET',
    url,
    headers: [{ key: 'Accept', value: 'application/json' }],
    params: [{ key: '', value: '' }],
    body: '',
  };
}

test('duplicateRequest inserts copy directly below source', () => {
  const state = {
    collections: [
      {
        id: 'col-1',
        name: 'API',
        environmentId: null,
        requests: [
          makeRequest('req-a', 'First', '/a'),
          makeRequest('req-b', 'Second', '/b'),
        ],
      },
    ],
  };

  const action = duplicateRequest('col-1', state.collections[0].requests[0]);
  const next = collectionReducer(state, action);

  const ids = next.collections[0].requests.map((r) => r.id);
  expect(ids[0]).toBe('req-a');
  expect(ids[2]).toBe('req-b');
  expect(ids[1]).toBe(action.payload.request.id);
  expect(ids[1]).not.toBe('req-a');
});

test('duplicateRequest deep-copies headers and names copy', () => {
  const source = makeRequest('req-a', 'List users', '/users');
  const state = {
    collections: [
      {
        id: 'col-1',
        name: 'API',
        environmentId: null,
        requests: [source],
      },
    ],
  };

  const action = duplicateRequest('col-1', source);
  const next = collectionReducer(state, action);
  const copy = next.collections[0].requests[1];

  expect(copy.name).toBe('List users (copy)');
  expect(copy.url).toBe('/users');
  expect(copy.headers).not.toBe(source.headers);
  expect(copy.headers[0]).toEqual(source.headers[0]);

  copy.headers[0].value = 'changed';
  expect(next.collections[0].requests[0].headers[0].value).toBe(
    'application/json'
  );
});
