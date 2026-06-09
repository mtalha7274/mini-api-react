# CollectionContext

Global collection + request tree state via `useReducer`. Hydrates from `localStorage` (`mini-api-collections`) on init; saves on every change.

## Usage

```jsx
import { useCollection } from './CollectionContext';
import { createCollection, renameCollection } from './collectionReducer';

const { collections, dispatch } = useCollection();
dispatch(createCollection());
```

Wrap the app with `CollectionProvider` (see `src/index.js`).

## Request shape

Each request in the tree stores the full editor state:

`{ id, name, method, url, headers: KeyValueRow[], params: KeyValueRow[], body: string, auth: RequestAuth }`

Each collection includes optional `environmentId` and `auth: { type: 'none' | 'bearer', token: string }`.

Legacy entries without `headers` / `params` / `body` / `auth` are normalized on load via `src/storage/appStorage.js`.

## Actions

| Action | Payload |
|--------|---------|
| `CREATE_COLLECTION` | `{ id, collection }` |
| `RENAME_COLLECTION` | `{ collectionId, name }` |
| `DELETE_COLLECTION` | `{ collectionId }` |
| `ADD_REQUEST_TO_COLLECTION` | `{ collectionId, request }` |
| `RENAME_REQUEST` | `{ collectionId, requestId, name }` |
| `DELETE_REQUEST` | `{ collectionId, requestId }` |
| `DUPLICATE_REQUEST` | `{ collectionId, sourceRequestId, request }` — inserts copy below source |
| `SYNC_REQUEST_EDITOR` | `{ requestId, method, url, headers, params, body, auth }` |
| `SET_COLLECTION_AUTH` | `{ collectionId, auth }` — `{ type: 'none' \| 'bearer', token }` |
| `SET_COLLECTION_ENVIRONMENT` | `{ collectionId, environmentId }` (`null` detaches) |
| `CLEAR_ENVIRONMENT_REFERENCES` | `{ environmentId }` |

Collections include optional `environmentId` linking to `EnvironmentContext`.

## UI

Sidebar collections panel: **+ Collection**, **+ Request**, inline rename (double-click or pencil), duplicate (copy icon), delete with confirm.

Mutations should go through `dispatch` only — not by editing `collections` in components.
