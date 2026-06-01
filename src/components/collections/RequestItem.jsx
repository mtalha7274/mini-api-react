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
 * @param {() => void} props.onDelete
 */
export default function RequestItem({
  request,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) {
  return (
    <div
      className={`group flex items-center gap-1 rounded-lg px-1 py-1 ${
        isActive ? 'bg-accent/15' : 'hover:bg-surfaceMuted'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
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
      <span onClick={(e) => e.stopPropagation()}>
        <IconButton
          label={`Delete request ${request.name}`}
          variant="ghost"
          onClick={onDelete}
          className="!h-7 !w-7 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        >
          ×
        </IconButton>
      </span>
    </div>
  );
}
