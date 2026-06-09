import { InlineRename } from '../shared';
import IconButton from '../shared/IconButton';

const METHOD_DOT = {
  GET: 'bg-method-dotGet',
  POST: 'bg-method-dotPost',
  PUT: 'bg-method-dotPut',
  PATCH: 'bg-method-dotPatch',
  DELETE: 'bg-method-dotDelete',
};

/**
 * @param {object} props
 * @param {{ id: string, name: string, method: string, url: string }} props.request
 * @param {boolean} props.isActive
 * @param {() => void} props.onSelect
 * @param {(name: string) => void} props.onRename
 * @param {() => void} props.onDuplicate
 * @param {() => void} props.onDelete
 */
export default function RequestItem({
  request,
  isActive,
  onSelect,
  onRename,
  onDuplicate,
  onDelete,
}) {
  return (
    <div
      className={`group flex items-center gap-1 rounded-lg px-1 py-1 transition-colors ${
        isActive ? 'bg-accent/15' : 'hover:bg-surfaceMuted'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        className={`flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isActive ? 'text-accent' : 'text-foreground'
        }`}
        aria-current={isActive ? 'true' : undefined}
      >
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${METHOD_DOT[request.method] || 'bg-muted'}`}
          aria-hidden
        />
        <InlineRename
          value={request.name}
          onCommit={onRename}
          className="text-sm"
        />
      </div>
      <span
        className="flex shrink-0 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          label={`Duplicate request ${request.name}`}
          variant="ghost"
          onClick={onDuplicate}
          className="!h-7 !w-7 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </IconButton>
        <IconButton
          label={`Delete request ${request.name}`}
          variant="ghost"
          onClick={onDelete}
          className="!h-7 !w-7 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        >
          ×
        </IconButton>
      </span>
    </div>
  );
}
