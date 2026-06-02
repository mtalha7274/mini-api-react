import { useCallback, useMemo, useState } from 'react';
import { AppShell } from '../components/layout';
import { useCollection } from '../context/CollectionContext/CollectionContext';
import {
  createCollection,
  renameCollection,
  deleteCollection,
  addRequestToCollection,
  renameRequest,
  deleteRequest,
  syncRequestRef,
  findRequestInCollections,
  getFirstRequestId,
  collectionReducer,
} from '../context/CollectionContext/collectionReducer';
import {
  mockHistory,
  mockEnvironments,
  mockActiveRequest,
  mockResponse,
  defaultEnvironmentId,
  cloneKeyValueRows,
  createEmptyKeyValue,
} from '../data/mockData';

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

export default function Home() {
  const { collections, dispatch } = useCollection();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState('collections');
  const [expandedIds, setExpandedIds] = useState({ 'col-1': true, 'col-2': false });
  const [activeRequestId, setActiveRequestId] = useState('req-1');
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  const [history] = useState(mockHistory);
  const [environments, setEnvironments] = useState(mockEnvironments);
  const [activeEnvironmentId, setActiveEnvironmentId] = useState(defaultEnvironmentId);

  const [request, setRequest] = useState(() => {
    const found = findRequestInCollections(
      collections,
      'req-1'
    );
    return found
      ? loadRequestIntoEditor(found.request)
      : { ...emptyEditorState };
  });

  const [response, setResponse] = useState(mockResponse);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const selectRequestById = useCallback(
    (requestId, cols) => {
      setActiveRequestId(requestId);
      setActiveHistoryId(null);
      const found = findRequestInCollections(cols, requestId);
      if (found) {
        setRequest(loadRequestIntoEditor(found.request));
      }
    },
    []
  );

  const handleRequestFieldChange = useCallback(
    (field, value) => {
      setRequest((prev) => {
        const next = { ...prev, [field]: value };
        if (activeRequestId && (field === 'method' || field === 'url')) {
          dispatch(syncRequestRef(activeRequestId, next.method, next.url));
        }
        return next;
      });
    },
    [activeRequestId, dispatch]
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
    dispatch(action);
    const { id } = action.payload;
    setExpandedIds((prev) => ({ ...prev, [id]: true }));
    setSidebarTab('collections');
  }, [dispatch]);

  const handleRenameCollection = useCallback(
    (collectionId, name) => {
      dispatch(renameCollection(collectionId, name));
    },
    [dispatch]
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
      dispatch(deleteAction);
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
    [collections, dispatch, activeRequestId, selectRequestById]
  );

  const handleAddRequest = useCallback(
    (collectionId) => {
      const action = addRequestToCollection(collectionId);
      dispatch(action);
      const { request: newReq } = action.payload;
      setExpandedIds((prev) => ({ ...prev, [collectionId]: true }));
      setActiveRequestId(newReq.id);
      setActiveHistoryId(null);
      setRequest({
        method: newReq.method,
        url: newReq.url,
        headers: [createEmptyKeyValue()],
        params: [createEmptyKeyValue()],
        body: '',
      });
      setSidebarTab('collections');
    },
    [dispatch]
  );

  const handleRenameRequest = useCallback(
    (collectionId, requestId, name) => {
      dispatch(renameRequest(collectionId, requestId, name));
    },
    [dispatch]
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
      dispatch(deleteAction);
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
    [collections, dispatch, activeRequestId, selectRequestById]
  );

  const handleSelectHistory = useCallback(
    (historyId) => {
      setActiveHistoryId(historyId);
      const item = history.find((h) => h.id === historyId);
      if (item) {
        setRequest((prev) => ({
          ...prev,
          method: item.method,
          url: item.url,
        }));
        if (item.response) {
          setResponse(item.response);
        }
      }
      closeSidebar();
    },
    [history, closeSidebar]
  );

  const handleEnvironmentChange = useCallback((envId) => {
    setActiveEnvironmentId(envId);
  }, []);

  const handleVariablesChange = useCallback((envId, variables) => {
    setEnvironments((prev) =>
      prev.map((env) =>
        env.id === envId ? { ...env, variables } : env
      )
    );
  }, []);

  const environmentProps = useMemo(
    () => ({
      environments,
      activeEnvironmentId,
      onEnvironmentChange: handleEnvironmentChange,
      onVariablesChange: handleVariablesChange,
    }),
    [
      environments,
      activeEnvironmentId,
      handleEnvironmentChange,
      handleVariablesChange,
    ]
  );

  const requestProps = useMemo(
    () => ({
      method: request.method,
      url: request.url,
      headers: request.headers,
      params: request.params,
      body: request.body,
      onChange: handleRequestFieldChange,
    }),
    [request, handleRequestFieldChange]
  );

  const sidebarProps = useMemo(
    () => ({
      activeTab: sidebarTab,
      onTabChange: setSidebarTab,
      collectionsProps: {
        collections,
        expandedIds,
        activeRequestId,
        onCreateCollection: handleCreateCollection,
        onToggleCollection: handleToggleCollection,
        onSelectRequest: handleSelectRequest,
        onRenameCollection: handleRenameCollection,
        onDeleteCollection: handleDeleteCollection,
        onAddRequest: handleAddRequest,
        onRenameRequest: handleRenameRequest,
        onDeleteRequest: handleDeleteRequest,
      },
      historyProps: {
        history,
        activeHistoryId,
        onSelect: handleSelectHistory,
      },
    }),
    [
      sidebarTab,
      collections,
      expandedIds,
      activeRequestId,
      handleCreateCollection,
      handleToggleCollection,
      handleSelectRequest,
      handleRenameCollection,
      handleDeleteCollection,
      handleAddRequest,
      handleRenameRequest,
      handleDeleteRequest,
      history,
      activeHistoryId,
      handleSelectHistory,
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
