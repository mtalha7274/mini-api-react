import {
  collectionReducer,
  duplicateRequest,
  setCollectionAuth,
  syncRequestEditor,
} from './collectionReducer';
import { DEFAULT_COLLECTION_AUTH, DEFAULT_REQUEST_AUTH } from '../../utils/auth';

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
    auth: { ...DEFAULT_REQUEST_AUTH },
  };
}

function makeCollection(requests) {
  return {
    id: 'col-1',
    name: 'API',
    environmentId: null,
    auth: { ...DEFAULT_COLLECTION_AUTH },
    requests,
  };
}

test('duplicateRequest inserts copy directly below source', () => {
  const state = {
    collections: [
      makeCollection([
        makeRequest('req-a', 'First', '/a'),
        makeRequest('req-b', 'Second', '/b'),
      ]),
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
    collections: [makeCollection([source])],
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

test('setCollectionAuth updates collection auth', () => {
  const state = {
    collections: [makeCollection([makeRequest('req-a', 'First')])],
  };

  const action = setCollectionAuth('col-1', {
    type: 'bearer',
    token: 'col-token',
  });
  const next = collectionReducer(state, action);

  expect(next.collections[0].auth).toEqual({
    type: 'bearer',
    token: 'col-token',
  });
});

test('syncRequestEditor persists request auth', () => {
  const state = {
    collections: [makeCollection([makeRequest('req-a', 'First')])],
  };

  const editor = {
    method: 'POST',
    url: '/login',
    headers: [{ key: '', value: '' }],
    params: [{ key: '', value: '' }],
    body: '{}',
    auth: { mode: 'override', type: 'bearer', token: 'req-token' },
  };

  const next = collectionReducer(state, syncRequestEditor('req-a', editor));
  expect(next.collections[0].requests[0].auth).toEqual(editor.auth);
});

test('duplicateRequest clones request auth', () => {
  const source = makeRequest('req-a', 'List users', '/users');
  source.auth = { mode: 'override', type: 'bearer', token: 'secret' };
  const state = { collections: [makeCollection([source])] };

  const action = duplicateRequest('col-1', source);
  const next = collectionReducer(state, action);
  const copy = next.collections[0].requests[1];

  expect(copy.auth).toEqual(source.auth);
  expect(copy.auth).not.toBe(source.auth);
});
