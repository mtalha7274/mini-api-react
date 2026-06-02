# API Request Builder (Mini Postman)

## 1. Project Overview

Build a web-based API client similar to a simplified version of Postman. Users should be able to create, organize, execute, and inspect HTTP requests.

Focus is on learning scalable React architecture using Context API + reducers rather than just UI building.

---

## 2. Core Learning Goals

- Context API for global state
- useReducer for complex state transitions
- Deep nested state handling
- Controlled form design
- API integration using fetch
- State normalization (collections, requests, environments)
- Separation of UI state vs data state

---

## 3. App Architecture Domains

### Request Domain

- HTTP method (GET, POST, PUT, DELETE)
- URL
- Headers
- Query params
- Body

### Environment Domain

- Base URLs
- Variables (e.g. `{{BASE_URL}}`)
- Active environment selection

### History Domain

- Executed requests
- Stored responses
- Timestamp and status

---

## 4. Core Features

### 4.1 Collections System

Group requests into folders.

**Features:**

- Create, rename, delete collections
- Add requests to collections
- Move requests between collections
- Expand/collapse tree structure

**Data model:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique collection id |
| `name` | string | Display name |
| `environmentId` | string \| null | Optional attached environment |
| `requests` | RequestRef[] | Requests in this collection |

```ts
Collection = { id, name, environmentId: string | null, requests: RequestRef[] }
RequestRef = { id, name, method, url }
```

### 4.2 Request Builder

Main editor for HTTP requests.

**Fields:**

- Method selector
- URL input
- Headers (key-value pairs)
- Query params (key-value pairs)
- Body editor (JSON or text)

**Features:**

- Dynamic key-value editors
- JSON validation
- Environment variable substitution

### 4.3 Environment Management

**Features:**

- Create, rename, delete environments (sidebar **Environments** tab)
- Add variables (key-value pairs) per environment
- Optionally attach an environment to each collection (dropdown on collection row)
- Main editor shows the **resolved** environment for the active request’s collection (read-only)
- Use variables in requests like `{{BASE_URL}}` (substitution in Phase 3 via resolved env)

### 4.4 Request Execution Engine

On Send:

1. Resolve environment variables
2. Build request config
3. Execute fetch call
4. Capture response (status, headers, body, duration)

### 4.5 Response Viewer

**Tabs:**

- Body (formatted JSON)
- Headers
- Status info
- Raw response

**Features:**

- Pretty JSON viewer
- Copy response
- Error display

### 4.6 Request History

**Features:**

- List executed requests
- Re-run request
- Store response snapshot
- Filter by method or collection

**Data model:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | History entry id |
| `method` | string | HTTP method |
| `url` | string | Request URL |
| `status` | number | HTTP status code |
| `timestamp` | string (ISO) | When executed |
| `duration` | number | ms elapsed |
| `response` | ResponseSnapshot | Stored response |

---

## 5. State Management (Context + Reducers) — Planned

### RequestContext

**State:**

```json
{
  "method": "GET",
  "url": "",
  "headers": [],
  "params": [],
  "body": ""
}
```

**Actions:**

- `SET_METHOD`
- `SET_URL`
- `ADD_HEADER` / `REMOVE_HEADER`
- `ADD_PARAM` / `REMOVE_PARAM`
- `SET_BODY`
- `RESET_REQUEST`

### CollectionContext

**State:**

```json
{
  "collections": [{ "id", "name", "requests": [] }],
  "activeCollectionId": null
}
```

**Actions:**

- `CREATE_COLLECTION`
- `DELETE_COLLECTION`
- `ADD_REQUEST_TO_COLLECTION`
- `MOVE_REQUEST`
- `RENAME_COLLECTION`

### HistoryContext

**State:**

```json
{
  "history": [{
    "id",
    "request",
    "response",
    "timestamp",
    "duration"
  }]
}
```

**Actions:**

- `ADD_HISTORY_ITEM`
- `CLEAR_HISTORY`
- `REMOVE_HISTORY_ITEM`

---

## 6. Component Structure

### Layout

- **AppShell**
  - Sidebar (Collections + History)
  - Main Editor
  - Response Panel

### Request Builder

- MethodSelector
- UrlInput
- HeadersEditor
- ParamsEditor
- BodyEditor
- SendButton
- RequestBuilder (composer)

### Collections Panel

- CollectionList
- CollectionItem
- RequestItem

### Environment

- EnvironmentList / EnvironmentListItem (sidebar tab)
- VariablesEditor (sidebar editing)
- EnvironmentPanel (read-only resolved env in main column)
- EnvironmentSelector (legacy; unused in main flow)

### Response Viewer

- StatusBar
- ResponseTabs
- BodyViewer
- HeadersViewer
- RawViewer
- ResponseViewer

### History Panel

- HistoryList
- HistoryItem

### Shared

- KeyValueEditor
- Tabs
- IconButton

---

## 7. Phased Roadmap

| Phase | Scope | Status |
|-------|--------|--------|
| **1** | Folder structure, Tailwind UI, mock data, Cursor rules | Done |
| **2** | CollectionContext + EnvironmentContext + reducers; RequestContext, HistoryContext | Partial |
| **3** | `src/lib/http/` per-method execution, `requestExecutor` facade, Send + live response | Partial |
| **4** | localStorage persistence, advanced enhancements | Planned |

### Theming (Phase 1)

- Semantic design tokens in [`src/styles/tokens.css`](src/styles/tokens.css) (`--color-background`, `--color-surface`, `--color-accent`, etc.)
- Tailwind maps tokens via [`tailwind.config.js`](tailwind.config.js); `darkMode: 'class'`
- [`src/theme/ThemeContext.jsx`](src/theme/ThemeContext.jsx) + sidebar [`ThemeToggle`](src/components/shared/ThemeToggle.jsx)
- Persistence: `localStorage` key `mini-api-theme`; first visit follows `prefers-color-scheme`
- Components use semantic utilities only (`bg-background`, `text-muted`, `border-border`) — no raw `slate-*` / `orange-*`

### Responsive layout

- **Desktop (`lg+`, 1024px):** fixed 280px sidebar + editor/response column (unchanged)
- **Mobile / tablet:** top bar with menu + theme toggle; sidebar as overlay drawer (`88vw` max); backdrop tap to close; closes on collection request selection
- **Desktop (`lg+`):** draggable vertical handle between sidebar and editor; width persisted (`mini-api-sidebar-width`)
- **Small (`sm`, 640px):** request bar stacks (method, URL, Send); key-value editors single-column
- Viewport: `100dvh` on `#root` for mobile browser chrome

### Collections CRUD (CollectionContext)

- [`src/context/CollectionContext/`](src/context/CollectionContext/) — `useCollection()`, `collectionReducer`
- Sidebar: **+ Collection**, **+ Request**, inline rename, delete (confirm)
- Per-collection environment attach dropdown (`SET_COLLECTION_ENVIRONMENT`)
- **Empty bootstrap:** first visit has no collections/requests; sidebar shows empty state
- **Persistence:** `localStorage` key `mini-api-collections`; provider hydrates on load, saves on change
- **RequestRef:** `{ id, name, method, url, headers, params, body }` — editor syncs all fields via `SYNC_REQUEST_EDITOR` for active request

### Environments (EnvironmentContext)

- [`src/context/EnvironmentContext/`](src/context/EnvironmentContext/) — `useEnvironment()`, `environmentReducer`
- Sidebar **Environments** tab: **+ Environment**, rename, delete, variables editor
- **Empty bootstrap:** first visit has no environments; top environment bar hidden until a collection attaches one
- **Persistence:** `localStorage` key `mini-api-environments`; provider hydrates on load, saves on change
- Deleting an environment clears `environmentId` on attached collections (`CLEAR_ENVIRONMENT_REFERENCES`)
- Send resolves variables from the active collection’s attached environment via `envParser` + `buildRequest`

### Request execution (`src/lib/http/`)

- One file per method: `get.js`, `post.js`, `put.js`, `patch.js`, `delete.js`
- `buildRequest.js` — env substitution, query params, headers, body rules
- `index.js` — `executeHttpRequest` router; errors return status `0` snapshot
- [`src/utils/requestExecutor.js`](src/utils/requestExecutor.js) re-exports for UI (`Home.jsx` only)
- Cross-origin requests require target server CORS; no proxy in-app

### Phase 1 acceptance

- Three-region layout (sidebar | editor + response)
- Collections / Environments sidebar tabs (History tab deferred)
- Request builder with method, URL, params, headers, body
- Environment management in sidebar; resolved env banner in main column
- Response viewer with tabs (live response after Send)
- No `fetch` in components (only `src/lib/http/`)

---

## 8. Folder Structure

```text
src/
  context/
    RequestContext/
    CollectionContext/
    EnvironmentContext/
    HistoryContext/
  components/
    layout/
    shared/
    request/
    collections/
    environment/
    response/
    history/
  pages/
    Home.jsx
  data/
    mockData.js
  storage/
    appStorage.js
  lib/
    http/
      get.js, post.js, put.js, patch.js, delete.js
      buildRequest.js, parseResponse.js, index.js
  utils/
    requestExecutor.js
    envParser.js
    envParser.js
```

---

## 9. UI Layout

```text
| Collections | Request Builder |
| History     | Response Viewer |
----------------------------------
```

- Left column (~280px): sidebar with Collections | History toggle
- Right column top: environment bar + request builder
- Right column bottom: response panel (~40vh min height)

---

## 10. Advanced Enhancements (Future)

- Persist history, last response, UI tab state (collections/environments done — see `src/storage/appStorage.js`)
- Request cloning
- Middleware-style logging in reducers
- Optimistic history updates
- Debounced URL input
- Multiple request tabs

---

## 11. Stretch Goals

- Import/export Postman collections (JSON)
- GraphQL support
- Curl generator
- Request tabs system
- Response time graph visualization
