import { generateId } from '../../utils/generateId';
import { createEmptyKeyValue, cloneKeyValueRows } from '../../data/mockData';

export const CollectionActionTypes = {
  CREATE_COLLECTION: 'CREATE_COLLECTION',
  RENAME_COLLECTION: 'RENAME_COLLECTION',
  DELETE_COLLECTION: 'DELETE_COLLECTION',
  ADD_REQUEST_TO_COLLECTION: 'ADD_REQUEST_TO_COLLECTION',
  RENAME_REQUEST: 'RENAME_REQUEST',
  DELETE_REQUEST: 'DELETE_REQUEST',
  SYNC_REQUEST_EDITOR: 'SYNC_REQUEST_EDITOR',
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
 * @param {string} requestId
 * @param {{ method: string, url: string, headers: object[], params: object[], body: string }} editor
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

    case CollectionActionTypes.SYNC_REQUEST_EDITOR: {
      const { requestId, method, url, headers, params, body } =
        action.payload;
      return {
        ...state,
        collections: state.collections.map((col) => ({
          ...col,
          requests: col.requests.map((req) =>
            req.id === requestId
              ? { ...req, method, url, headers, params, body }
              : req
          ),
        })),
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
