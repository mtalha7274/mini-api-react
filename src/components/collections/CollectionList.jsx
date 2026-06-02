import CollectionItem from './CollectionItem';

/**
 * @param {object} props
 * @param {Array<{ id: string, name: string, environmentId: string | null, requests: object[] }>} props.collections
 * @param {Array<{ id: string, name: string }>} props.environments
 * @param {Record<string, boolean>} props.expandedIds
 * @param {string | null} props.activeRequestId
 * @param {() => void} props.onCreateCollection
 * @param {(collectionId: string) => void} props.onToggleCollection
 * @param {(requestId: string) => void} props.onSelectRequest
 * @param {(collectionId: string, name: string) => void} props.onRenameCollection
 * @param {(collectionId: string) => void} props.onDeleteCollection
 * @param {(collectionId: string, environmentId: string | null) => void} props.onSetCollectionEnvironment
 * @param {(collectionId: string) => void} props.onAddRequest
 * @param {(collectionId: string, requestId: string, name: string) => void} props.onRenameRequest
 * @param {(collectionId: string, requestId: string) => void} props.onDeleteRequest
 */
export default function CollectionList({
  collections,
  environments,
  expandedIds,
  activeRequestId,
  onCreateCollection,
  onToggleCollection,
  onSelectRequest,
  onRenameCollection,
  onDeleteCollection,
  onSetCollectionEnvironment,
  onAddRequest,
  onRenameRequest,
  onDeleteRequest,
}) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-border p-2">
        <button
          type="button"
          onClick={onCreateCollection}
          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-surfaceMuted hover:text-accent-hover"
        >
          + Collection
        </button>
      </div>
      <div className="space-y-1 p-2">
        {collections.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted">
            No collections yet
          </p>
        ) : (
          collections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              environments={environments}
              isExpanded={!!expandedIds[collection.id]}
              activeRequestId={activeRequestId}
              onToggle={() => onToggleCollection(collection.id)}
              onSelectRequest={onSelectRequest}
              onRename={(name) => onRenameCollection(collection.id, name)}
              onDelete={() => onDeleteCollection(collection.id)}
              onSetEnvironment={(environmentId) =>
                onSetCollectionEnvironment(collection.id, environmentId)
              }
              onAddRequest={() => onAddRequest(collection.id)}
              onRenameRequest={(requestId, name) =>
                onRenameRequest(collection.id, requestId, name)
              }
              onDeleteRequest={(requestId) =>
                onDeleteRequest(collection.id, requestId)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
