# CollectionContext

Global collection + request tree state via `useReducer`.

## Usage

```jsx
import { useCollection } from './CollectionContext';
import { createCollection, renameCollection } from './collectionReducer';

const { collections, dispatch } = useCollection();
dispatch(createCollection());
```

Wrap the app with `CollectionProvider` (see `src/index.js`).

## Actions

| Action | Payload |
|--------|---------|
| `CREATE_COLLECTION` | `{ id, collection }` |
| `RENAME_COLLECTION` | `{ collectionId, name }` |
| `DELETE_COLLECTION` | `{ collectionId }` |
| `ADD_REQUEST_TO_COLLECTION` | `{ collectionId, request }` |
| `RENAME_REQUEST` | `{ collectionId, requestId, name }` |
| `DELETE_REQUEST` | `{ collectionId, requestId }` |
| `SYNC_REQUEST_REF` | `{ requestId, method, url }` |
| `SET_COLLECTION_ENVIRONMENT` | `{ collectionId, environmentId }` (`null` detaches) |
| `CLEAR_ENVIRONMENT_REFERENCES` | `{ environmentId }` |

Collections include optional `environmentId` linking to `EnvironmentContext`.

## UI

Sidebar collections panel: **+ Collection**, **+ Request**, inline rename (double-click or pencil), delete with confirm.

Mutations should go through `dispatch` only — not by editing `collections` in components.
