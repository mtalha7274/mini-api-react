import { InlineRename } from '../shared';
import IconButton from '../shared/IconButton';
import SelectChevron from '../shared/SelectChevron';
import RequestItem from './RequestItem';

/**
 * @param {object} props
 * @param {{ id: string, name: string, environmentId: string | null, requests: object[] }} props.collection
 * @param {Array<{ id: string, name: string }>} props.environments
 * @param {boolean} props.isExpanded
 * @param {string | null} props.activeRequestId
 * @param {() => void} props.onToggle
 * @param {(requestId: string) => void} props.onSelectRequest
 * @param {(name: string) => void} props.onRename
 * @param {() => void} props.onDelete
 * @param {(environmentId: string | null) => void} props.onSetEnvironment
 * @param {() => void} props.onAddRequest
 * @param {(requestId: string, name: string) => void} props.onRenameRequest
 * @param {(requestId: string) => void} props.onDeleteRequest
 */
export default function CollectionItem({
  collection,
  environments,
  isExpanded,
  activeRequestId,
  onToggle,
  onSelectRequest,
  onRename,
  onDelete,
  onSetEnvironment,
  onAddRequest,
  onRenameRequest,
  onDeleteRequest,
}) {
  const hasActiveRequest = collection.requests.some(
    (r) => r.id === activeRequestId
  );

  return (
    <div className="mb-1">
      <div
        className={`group flex items-center gap-1 rounded-lg px-1 py-1 transition-colors ${
          hasActiveRequest
            ? 'bg-accent/12'
            : 'hover:bg-surfaceMuted'
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex h-8 w-6 shrink-0 items-center justify-center text-xs text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={isExpanded ? 'Collapse collection' : 'Expand collection'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
        <InlineRename
          value={collection.name}
          onCommit={onRename}
          className={`text-sm font-medium ${
            hasActiveRequest ? 'text-accent' : 'text-foreground'
          }`}
        />
        <span className="shrink-0 px-1 text-xs text-muted">
          {collection.requests.length}
        </span>
        <span
          className="relative shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <select
            aria-label={`Environment for ${collection.name}`}
            value={collection.environmentId ?? ''}
            onChange={(e) =>
              onSetEnvironment(e.target.value === '' ? null : e.target.value)
            }
            className="select-control-env max-w-[7rem] appearance-none rounded border border-border bg-input py-0.5 pl-1.5 pr-5 text-xs text-foreground focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-[6.5rem]"
          >
            <option value="">None</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
          <SelectChevron />
        </span>
        <span onClick={(e) => e.stopPropagation()}>
          <IconButton
            label={`Delete collection ${collection.name}`}
            variant="ghost"
            onClick={onDelete}
            className="!h-7 !w-7 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
          >
            ×
          </IconButton>
        </span>
      </div>
      {isExpanded && (
        <div className="ml-4 space-y-0.5 pl-1">
          {collection.requests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              isActive={activeRequestId === request.id}
              onSelect={() => onSelectRequest(request.id)}
              onRename={(name) => onRenameRequest(request.id, name)}
              onDelete={() => onDeleteRequest(request.id)}
            />
          ))}
          <button
            type="button"
            onClick={onAddRequest}
            className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-surfaceMuted hover:text-accent-hover"
          >
            + Request
          </button>
        </div>
      )}
    </div>
  );
}
