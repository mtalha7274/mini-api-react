import {
  findEnvTokenAtIndex,
  splitEnvTokens,
  variablesArrayToMap,
  resolveEnvVariables,
} from './envParser';

test('splitEnvTokens splits text and variable placeholders', () => {
  const parts = splitEnvTokens('{{BASE_URL}}/users');
  expect(parts).toEqual([
    { type: 'token', name: 'BASE_URL', value: '{{BASE_URL}}' },
    { type: 'text', value: '/users' },
  ]);
});

test('findEnvTokenAtIndex finds token under cursor', () => {
  const url = '{{BASE_URL}}/users';
  expect(findEnvTokenAtIndex(url, 2)?.name).toBe('BASE_URL');
  expect(findEnvTokenAtIndex(url, 14)).toBeNull();
});

test('variablesArrayToMap builds lookup from rows', () => {
  expect(
    variablesArrayToMap([
      { key: 'BASE_URL', value: 'http://localhost' },
      { key: '', value: 'skip' },
    ])
  ).toEqual({ BASE_URL: 'http://localhost' });
});

test('resolveEnvVariables substitutes known keys', () => {
  expect(
    resolveEnvVariables('{{BASE_URL}}/x', { BASE_URL: 'https://api.test' })
  ).toBe('https://api.test/x');
});
