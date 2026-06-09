import { generateId } from '../../utils/generateId';
import { createEmptyKeyValue, cloneKeyValueRows } from '../../data/mockData';
import {
  DEFAULT_COLLECTION_AUTH,
  DEFAULT_REQUEST_AUTH,
  normalizeAuth,
} from '../../utils/auth';

export const CollectionActionTypes = {
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  RENAME_COLLECTION: 'RENAME_COLLECTION',
  DELETE_COLLECTION: 'DELETE_COLLECTION',
  ADD_REQUEST_TO_COLLECTION: 'ADD_REQUEST_TO_COLLECTION',
  RENAME_REQUEST: 'RENAME_REQUEST',
  DELETE_REQUEST: 'DELETE_REQUEST',
  DUPLICATE_REQUEST: 'DUPLICATE_REQUEST',
  SYNC_REQUEST_EDITOR: 'SYNC_REQUEST_EDITOR',
  SET_COLLECTION_AUTH: 'SET_COLLECTION_AUTH',
  SET_COLLECTION_ENVIRONMENT: 'SET_COLLECTION_ENVIRONMENT',
  CLEAR_ENVIRONMENT_REFERENCES: 'CLEAR_ENVIRONMENT_REFERENCES',
};

function createEmptyRequest(id) {
  return {
    id,
    name: 'New Request',
    method: 'GET',
    url: '',
    headers: [createEmptyKeyValue()],
    params: [createEmptyKeyValue()],
    body: '',
    auth: { ...DEFAULT_REQUEST_AUTH },
  };
}

/**
 * @param {{ id: string, name: string, method: string, url: string, headers: object[], params: object[], body: string }} source
 */
function cloneRequestFrom(source) {
  const id = generateId('req');
  const baseName = source.name.trim() || 'Request';
  return {
    id,
    name: `${baseName} (copy)`,
    method: source.method,
    url: source.url,
    headers: cloneKeyValueRows(source.headers),
    params: cloneKeyValueRows(source.params),
    body: source.body ?? '',
    auth: normalizeAuth(source.auth, 'request'),
  };
}

export function createCollection() {
  const id = generateId('col');
  return {
    type: CollectionActionTypes.CREATE_COLLECTION,
    payload: {
      id,
      collection: {
        id,
        name: 'New Collection',
        environmentId: null,
        auth: { ...DEFAULT_COLLECTION_AUTH },
        requests: [],
      },
    },
  };
}

export function renameCollection(collectionId, name) {
  return {
    type: CollectionActionTypes.RENAME_COLLECTION,
    payload: { collectionId, name: name.trim() },
  };
}

export function deleteCollection(collectionId) {
  return {
    type: CollectionActionTypes.DELETE_COLLECTION,
    payload: { collectionId },
  };
}

export function addRequestToCollection(collectionId) {
  const id = generateId('req');
  return {
    type: CollectionActionTypes.ADD_REQUEST_TO_COLLECTION,
    payload: {
      collectionId,
      request: createEmptyRequest(id),
    },
  };
}

export function renameRequest(collectionId, requestId, name) {
  return {
    type: CollectionActionTypes.RENAME_REQUEST,
    payload: { collectionId, requestId, name: name.trim() },
  };
}

export function deleteRequest(collectionId, requestId) {
  return {
    type: CollectionActionTypes.DELETE_REQUEST,
    payload: { collectionId, requestId },
  };
}

/**
 * @param {string} collectionId
 * @param {{ id: string, name: string, method: string, url: string, headers: object[], params: object[], body: string }} sourceRequest
 */
export function duplicateRequest(collectionId, sourceRequest) {
  return {
    type: CollectionActionTypes.DUPLICATE_REQUEST,
    payload: {
      collectionId,
      sourceRequestId: sourceRequest.id,
      request: cloneRequestFrom(sourceRequest),
    },
  };
}

/**
 * @param {string} requestId
 * @param {{ method: string, url: string, headers: object[], params: object[], body: string, auth?: object }} editor
 */
export function syncRequestEditor(requestId, editor) {
  return {
    type: CollectionActionTypes.SYNC_REQUEST_EDITOR,
    payload: {
      requestId,
      method: editor.method,
      url: editor.url,
      headers: cloneKeyValueRows(editor.headers),
      params: cloneKeyValueRows(editor.params),
      body: editor.body,
      auth: normalizeAuth(editor.auth, 'request'),
    },
  };
}

export function setCollectionAuth(collectionId, auth) {
  return {
    type: CollectionActionTypes.SET_COLLECTION_AUTH,
    payload: {
      collectionId,
      auth: normalizeAuth(auth, 'collection'),
    },
  };
}

export function setCollectionEnvironment(collectionId, environmentId) {
  return {
    type: CollectionActionTypes.SET_COLLECTION_ENVIRONMENT,
    payload: { collectionId, environmentId },
  };
}

export function clearEnvironmentReferences(environmentId) {
  return {
    type: CollectionActionTypes.CLEAR_ENVIRONMENT_REFERENCES,
    payload: { environmentId },
  };
}

export function collectionReducer(state, action) {
  switch (action.type) {
    case CollectionActionTypes.CREATE_COLLECTION:
      return {
        ...state,
        collections: [...state.collections, action.payload.collection],
      };

    case CollectionActionTypes.RENAME_COLLECTION: {
      const { collectionId, name } = action.payload;
      if (!name) return state;
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.id === collectionId ? { ...col, name } : col
        ),
      };
    }

    case CollectionActionTypes.DELETE_COLLECTION:
      return {
        ...state,
        collections: state.collections.filter(
          (col) => col.id !== action.payload.collectionId
        ),
      };

    case CollectionActionTypes.ADD_REQUEST_TO_COLLECTION:
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.id === action.payload.collectionId
            ? {
                ...col,
                requests: [...col.requests, action.payload.request],
              }
            : col
        ),
      };

    case CollectionActionTypes.RENAME_REQUEST: {
      const { collectionId, requestId, name } = action.payload;
      if (!name) return state;
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                requests: col.requests.map((req) =>
                  req.id === requestId ? { ...req, name } : req
                ),
              }
            : col
        ),
      };
    }

    case CollectionActionTypes.DELETE_REQUEST: {
      const { collectionId, requestId } = action.payload;
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                requests: col.requests.filter((req) => req.id !== requestId),
              }
            : col
        ),
      };
    }

    case CollectionActionTypes.DUPLICATE_REQUEST: {
      const { collectionId, sourceRequestId, request } = action.payload;
      return {
        ...state,
        collections: state.collections.map((col) => {
          if (col.id !== collectionId) return col;
          const index = col.requests.findIndex((r) => r.id === sourceRequestId);
          if (index === -1) return col;
          const requests = [...col.requests];
          requests.splice(index + 1, 0, request);
          return { ...col, requests };
        }),
      };
    }

    case CollectionActionTypes.SYNC_REQUEST_EDITOR: {
      const { requestId, method, url, headers, params, body, auth } =
        action.payload;
      return {
        ...state,
        collections: state.collections.map((col) => ({
          ...col,
          requests: col.requests.map((req) =>
            req.id === requestId
              ? { ...req, method, url, headers, params, body, auth }
              : req
          ),
        })),
      };
    }

    case CollectionActionTypes.SET_COLLECTION_AUTH: {
      const { collectionId, auth } = action.payload;
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.id === collectionId ? { ...col, auth } : col
        ),
      };
    }

    case CollectionActionTypes.SET_COLLECTION_ENVIRONMENT: {
      const { collectionId, environmentId } = action.payload;
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.id === collectionId ? { ...col, environmentId } : col
        ),
      };
    }

    case CollectionActionTypes.CLEAR_ENVIRONMENT_REFERENCES: {
      const { environmentId } = action.payload;
      return {
        ...state,
        collections: state.collections.map((col) =>
          col.environmentId === environmentId
            ? { ...col, environmentId: null }
            : col
        ),
      };
    }

    default:
      return state;
  }
}

export function findRequestInCollections(collections, requestId) {
  for (const col of collections) {
    const req = col.requests.find((r) => r.id === requestId);
    if (req) return { collection: col, request: req };
  }
  return null;
}

export function getFirstRequestId(collections) {
  for (const col of collections) {
    if (col.requests.length > 0) return col.requests[0].id;
  }
  return null;
}
