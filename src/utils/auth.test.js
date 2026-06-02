import {
  DEFAULT_COLLECTION_AUTH,
  DEFAULT_REQUEST_AUTH,
  normalizeAuth,
  resolveEffectiveAuth,
  formatAuthSummary,
} from './auth';

test('normalizeAuth returns defaults for invalid input', () => {
  expect(normalizeAuth(null, 'collection')).toEqual(DEFAULT_COLLECTION_AUTH);
  expect(normalizeAuth(undefined, 'request')).toEqual(DEFAULT_REQUEST_AUTH);
});

test('normalizeAuth coerces collection auth fields', () => {
  expect(
    normalizeAuth({ type: 'bearer', token: 'abc' }, 'collection')
  ).toEqual({ type: 'bearer', token: 'abc' });
  expect(normalizeAuth({ type: 'basic', token: 1 }, 'collection')).toEqual({
    type: 'none',
    token: '',
  });
});

test('normalizeAuth coerces request auth fields', () => {
  expect(
    normalizeAuth(
      { mode: 'override', type: 'bearer', token: 'tok' },
      'request'
    )
  ).toEqual({ mode: 'override', type: 'bearer', token: 'tok' });
  expect(normalizeAuth({ mode: 'custom' }, 'request')).toEqual(
    DEFAULT_REQUEST_AUTH
  );
});

test('resolveEffectiveAuth inherits collection auth by default', () => {
  const collection = { type: 'bearer', token: 'col-token' };
  const request = { mode: 'inherit', type: 'none', token: '' };
  expect(resolveEffectiveAuth(collection, request)).toEqual(collection);
});

test('resolveEffectiveAuth uses request override when set', () => {
  const collection = { type: 'bearer', token: 'col-token' };
  const request = { mode: 'override', type: 'bearer', token: 'req-token' };
  expect(resolveEffectiveAuth(collection, request)).toEqual({
    type: 'bearer',
    token: 'req-token',
  });
});

test('formatAuthSummary describes auth state', () => {
  expect(formatAuthSummary({ type: 'none', token: '' })).toBe(
    'No authorization'
  );
  expect(formatAuthSummary({ type: 'bearer', token: '{{API_KEY}}' })).toBe(
    'Bearer token: {{API_KEY}}'
  );
});
