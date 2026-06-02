# EnvironmentContext

Global environment definitions and variables via `useReducer`.

## Usage

```jsx
import { useEnvironment } from './EnvironmentContext';
import { createEnvironment, updateEnvironmentVariables } from './environmentReducer';

const { environments, dispatch } = useEnvironment();
dispatch(createEnvironment());
```

Wrap the app with `EnvironmentProvider` inside `CollectionProvider` (see `src/index.js`).

## Actions

| Action | Payload |
|--------|---------|
| `CREATE_ENVIRONMENT` | `{ id, environment }` |
| `RENAME_ENVIRONMENT` | `{ environmentId, name }` |
| `DELETE_ENVIRONMENT` | `{ environmentId }` |
| `UPDATE_ENVIRONMENT_VARIABLES` | `{ environmentId, variables }` |

## Collection attachment

Collections store optional `environmentId`. Set via `setCollectionEnvironment` in `CollectionContext`. When an environment is deleted, dispatch `clearEnvironmentReferences` on the collection reducer from the same handler.

Mutations should go through `dispatch` only — not by editing `environments` in components.
