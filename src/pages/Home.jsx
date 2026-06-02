import { useCallback, useMemo, useState } from 'react';
import { AppShell } from '../components/layout';
import { useCollection } from '../context/CollectionContext/CollectionContext';
import { useEnvironment } from '../context/EnvironmentContext/EnvironmentContext';
import {
  createCollection,
  renameCollection,
  deleteCollection,
  addRequestToCollection,
  renameRequest,
  deleteRequest,
  syncRequestRef,
  setCollectionEnvironment,
  clearEnvironmentReferences,
  findRequestInCollections,
  getFirstRequestId,
  collectionReducer,
} from '../context/CollectionContext/collectionReducer';
import {
  createEnvironment,
  renameEnvironment,
  deleteEnvironment,
  updateEnvironmentVariables,
  environmentReducer,
} from '../context/EnvironmentContext/environmentReducer';
import {
  mockActiveRequest,
  mockResponse,
  cloneKeyValueRows,
  createEmptyKeyValue,
} from '../data/mockData';
import { canSendRequest } from '../lib/http/canSendRequest';
import { variablesArrayToMap } from '../utils/envParser';
import { executeRequest } from '../utils/requestExecutor';

const emptyEditorState = {
  method: 'GET',
  url: '',
  headers: [createEmptyKeyValue()],
  params: [createEmptyKeyValue()],
  body: '',
};

function loadRequestIntoEditor(ref) {
  if (!ref) return { ...emptyEditorState };
  return {
    method: ref.method,
    url: ref.url,
    headers: cloneKeyValueRows(mockActiveRequest.headers),
    params: cloneKeyValueRows(mockActiveRequest.params),
    body: mockActiveRequest.body,
  };
}

function countCollectionsUsingEnvironment(collections, environmentId) {
  return collections.filter((col) => col.environmentId === environmentId)
    .length;
}

export default function Home() {
  const { collections, dispatch: collectionDispatch } = useCollection();
  const { environments, dispatch: environmentDispatch } = useEnvironment();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('collections');
  const [expandedIds, setExpandedIds] = useState({ 'col-1': true, 'col-2': false });
  const [activeRequestId, setActiveRequestId] = useState('req-1');
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState('env-dev');

  const [request, setRequest] = useState(() => {
    const found = findRequestInCollections(collections, 'req-1');
    return found
      ? loadRequestIntoEditor(found.request)
      : { ...emptyEditorState };
  });

  const [response, setResponse] = useState(mockResponse);
  const [isSending, setIsSending] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const activeCollectionContext = useMemo(() => {
    if (!activeRequestId) return null;
    return findRequestInCollections(collections, activeRequestId);
  }, [collections, activeRequestId]);

  const resolvedEnvironment = useMemo(() => {
    const envId = activeCollectionContext?.collection.environmentId;
    if (!envId) return null;
    return environments.find((e) => e.id === envId) ?? null;
  }, [environments, activeCollectionContext]);

  const envVariableMap = useMemo(
    () => variablesArrayToMap(resolvedEnvironment?.variables ?? []),
    [resolvedEnvironment]
  );

  const selectRequestById = useCallback((requestId, cols) => {
    setActiveRequestId(requestId);
    const found = findRequestInCollections(cols, requestId);
    if (found) {
      setRequest(loadRequestIntoEditor(found.request));
    }
  }, []);

  const handleRequestFieldChange = useCallback(
    (field, value) => {
      setRequest((prev) => {
        const next = { ...prev, [field]: value };
        if (activeRequestId && (field === 'method' || field === 'url')) {
          collectionDispatch(
            syncRequestRef(activeRequestId, next.method, next.url)
          );
        }
        return next;
      });
    },
    [activeRequestId, collectionDispatch]
  );

  const handleToggleCollection = useCallback((collectionId) => {
    setExpandedIds((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  }, []);

  const handleSelectRequest = useCallback(
    (requestId) => {
      selectRequestById(requestId, collections);
      closeSidebar();
    },
    [collections, selectRequestById, closeSidebar]
  );

  const handleCreateCollection = useCallback(() => {
    const action = createCollection();
    collectionDispatch(action);
    const { id } = action.payload;
    setExpandedIds((prev) => ({ ...prev, [id]: true }));
    setSidebarTab('collections');
  }, [collectionDispatch]);

  const handleRenameCollection = useCallback(
    (collectionId, name) => {
      collectionDispatch(renameCollection(collectionId, name));
    },
    [collectionDispatch]
  );

  const handleDeleteCollection = useCallback(
    (collectionId) => {
      const col = collections.find((c) => c.id === collectionId);
      if (
        !col ||
        !window.confirm(
          `Delete collection "${col.name}" and all its requests?`
        )
      ) {
        return;
      }
      const deleteAction = deleteCollection(collectionId);
      const nextCollections = collectionReducer(
        { collections },
        deleteAction
      ).collections;
      collectionDispatch(deleteAction);
      setExpandedIds((prev) => {
        const next = { ...prev };
        delete next[collectionId];
        return next;
      });
      if (
        activeRequestId &&
        col.requests.some((r) => r.id === activeRequestId)
      ) {
        const nextId = getFirstRequestId(nextCollections);
        if (nextId) {
          selectRequestById(nextId, nextCollections);
        } else {
          setActiveRequestId(null);
          setRequest({ ...emptyEditorState });
        }
      }
    },
    [collections, collectionDispatch, activeRequestId, selectRequestById]
  );

  const handleSetCollectionEnvironment = useCallback(
    (collectionId, environmentId) => {
      collectionDispatch(setCollectionEnvironment(collectionId, environmentId));
    },
    [collectionDispatch]
  );

  const handleAddRequest = useCallback(
    (collectionId) => {
      const action = addRequestToCollection(collectionId);
      collectionDispatch(action);
      const { request: newReq } = action.payload;
      setExpandedIds((prev) => ({ ...prev, [collectionId]: true }));
      setActiveRequestId(newReq.id);
      setRequest({
        method: newReq.method,
        url: newReq.url,
        headers: [createEmptyKeyValue()],
        params: [createEmptyKeyValue()],
        body: '',
      });
      setSidebarTab('collections');
    },
    [collectionDispatch]
  );

  const handleRenameRequest = useCallback(
    (collectionId, requestId, name) => {
      collectionDispatch(renameRequest(collectionId, requestId, name));
    },
    [collectionDispatch]
  );

  const handleDeleteRequest = useCallback(
    (collectionId, requestId) => {
      const col = collections.find((c) => c.id === collectionId);
      const req = col?.requests.find((r) => r.id === requestId);
      if (!req || !window.confirm(`Delete request "${req.name}"?`)) {
        return;
      }
      const deleteAction = deleteRequest(collectionId, requestId);
      const nextCollections = collectionReducer(
        { collections },
        deleteAction
      ).collections;
      collectionDispatch(deleteAction);
      if (activeRequestId === requestId) {
        const nextId = getFirstRequestId(nextCollections);
        if (nextId) {
          selectRequestById(nextId, nextCollections);
        } else {
          setActiveRequestId(null);
          setRequest({ ...emptyEditorState });
        }
      }
    },
    [collections, collectionDispatch, activeRequestId, selectRequestById]
  );

  const handleCreateEnvironment = useCallback(() => {
    const action = createEnvironment();
    environmentDispatch(action);
    setSelectedEnvironmentId(action.payload.id);
    setSidebarTab('environments');
  }, [environmentDispatch]);

  const handleRenameEnvironment = useCallback(
    (environmentId, name) => {
      environmentDispatch(renameEnvironment(environmentId, name));
    },
    [environmentDispatch]
  );

  const handleDeleteEnvironment = useCallback(
    (environmentId) => {
      const env = environments.find((e) => e.id === environmentId);
      if (!env) return;

      const refCount = countCollectionsUsingEnvironment(
        collections,
        environmentId
      );
      const refNote =
        refCount > 0
          ? ` It is attached to ${refCount} collection${refCount === 1 ? '' : 's'}.`
          : '';

      if (!window.confirm(`Delete environment "${env.name}"?${refNote}`)) {
        return;
      }

      const deleteAction = deleteEnvironment(environmentId);
      const nextEnvironments = environmentReducer(
        { environments },
        deleteAction
      ).environments;
      environmentDispatch(deleteAction);
      collectionDispatch(clearEnvironmentReferences(environmentId));

      if (selectedEnvironmentId === environmentId) {
        setSelectedEnvironmentId(nextEnvironments[0]?.id ?? null);
      }
    },
    [
      environments,
      collections,
      environmentDispatch,
      collectionDispatch,
      selectedEnvironmentId,
    ]
  );

  const handleSend = useCallback(async () => {
    if (!canSendRequest(request) || isSending) return;

    setIsSending(true);
    try {
      const result = await executeRequest({
        method: request.method,
        url: request.url,
        headers: request.headers,
        params: request.params,
        body: request.body,
        envVariableMap,
      });
      setResponse(result);
    } finally {
      setIsSending(false);
    }
  }, [request, envVariableMap, isSending]);

  const handleVariablesChange = useCallback(
    (environmentId, variables) => {
      environmentDispatch(
        updateEnvironmentVariables(environmentId, variables)
      );
    },
    [environmentDispatch]
  );

  const environmentProps = useMemo(
    () => ({
      resolvedEnvironment,
      onVariablesChange: handleVariablesChange,
    }),
    [resolvedEnvironment, handleVariablesChange]
  );

  const requestProps = useMemo(
    () => ({
      method: request.method,
      url: request.url,
      headers: request.headers,
      params: request.params,
      body: request.body,
      envVariableMap,
      onChange: handleRequestFieldChange,
      onSend: handleSend,
      isSending,
    }),
    [request, envVariableMap, handleRequestFieldChange, handleSend, isSending]
  );

  const sidebarProps = useMemo(
    () => ({
      activeTab: sidebarTab,
      onTabChange: setSidebarTab,
      collectionsProps: {
        collections,
        environments,
        expandedIds,
        activeRequestId,
        onCreateCollection: handleCreateCollection,
        onToggleCollection: handleToggleCollection,
        onSelectRequest: handleSelectRequest,
        onRenameCollection: handleRenameCollection,
        onDeleteCollection: handleDeleteCollection,
        onSetCollectionEnvironment: handleSetCollectionEnvironment,
        onAddRequest: handleAddRequest,
        onRenameRequest: handleRenameRequest,
        onDeleteRequest: handleDeleteRequest,
      },
      environmentsProps: {
        environments,
        selectedEnvironmentId,
        onCreateEnvironment: handleCreateEnvironment,
        onSelectEnvironment: setSelectedEnvironmentId,
        onRenameEnvironment: handleRenameEnvironment,
        onDeleteEnvironment: handleDeleteEnvironment,
        onVariablesChange: handleVariablesChange,
      },
    }),
    [
      sidebarTab,
      collections,
      environments,
      expandedIds,
      activeRequestId,
      handleCreateCollection,
      handleToggleCollection,
      handleSelectRequest,
      handleRenameCollection,
      handleDeleteCollection,
      handleSetCollectionEnvironment,
      handleAddRequest,
      handleRenameRequest,
      handleDeleteRequest,
      selectedEnvironmentId,
      handleCreateEnvironment,
      handleRenameEnvironment,
      handleDeleteEnvironment,
      handleVariablesChange,
    ]
  );

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onOpenSidebar={openSidebar}
      onCloseSidebar={closeSidebar}
      sidebarProps={sidebarProps}
      environmentProps={environmentProps}
      requestProps={requestProps}
      response={response}
    />
  );
}
