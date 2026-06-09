import { emptyResponse } from '../data/mockData';
import {
  getResponseForRequest,
  setResponseForRequest,
  removeResponseForRequest,
  removeResponsesForRequestIds,
} from './responseCache';

const sampleResponse = {
  status: 200,
  statusText: 'OK',
  duration: 50,
  headers: { 'content-type': 'application/json' },
  body: { ok: true },
};

test('getResponseForRequest returns emptyResponse when id is missing', () => {
  expect(getResponseForRequest({}, 'req-1')).toEqual(emptyResponse);
  expect(getResponseForRequest({ 'req-2': sampleResponse }, 'req-1')).toEqual(
    emptyResponse
  );
  expect(getResponseForRequest({}, null)).toEqual(emptyResponse);
});

test('setResponseForRequest stores snapshot per id', () => {
  const map = setResponseForRequest({}, 'req-a', sampleResponse);
  expect(getResponseForRequest(map, 'req-a')).toEqual(sampleResponse);
  expect(getResponseForRequest(map, 'req-b')).toEqual(emptyResponse);
});

test('removeResponseForRequest deletes only the target id', () => {
  const map = {
    'req-a': sampleResponse,
    'req-b': { ...sampleResponse, status: 404 },
  };
  const next = removeResponseForRequest(map, 'req-a');
  expect(next['req-a']).toBeUndefined();
  expect(next['req-b']).toEqual(map['req-b']);
});

test('removeResponsesForRequestIds deletes multiple ids', () => {
  const map = {
    'req-a': sampleResponse,
    'req-b': { ...sampleResponse, status: 201 },
    'req-c': { ...sampleResponse, status: 500 },
  };
  const next = removeResponsesForRequestIds(map, ['req-a', 'req-c']);
  expect(Object.keys(next)).toEqual(['req-b']);
});
