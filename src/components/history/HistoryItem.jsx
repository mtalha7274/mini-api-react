const METHOD_BADGE = {
  GET: 'text-method-get',
  POST: 'text-method-post',
  PUT: 'text-method-put',
  PATCH: 'text-method-patch',
  DELETE: 'text-method-delete',
};

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/**
 * @param {object} props
 * @param {object} props.item
 * @param {boolean} props.isActive
 * @param {() => void} props.onSelect
 */
export default function HistoryItem({ item, isActive, onSelect }) {
  const statusOk = item.status >= 200 && item.status < 300;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        isActive
          ? 'bg-accent/15 text-accent'
          : 'text-foreground hover:bg-surfaceMuted'
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold ${METHOD_BADGE[item.method] || 'text-muted'}`}
        >
          {item.method}
        </span>
        <span
          className={`text-xs font-medium ${statusOk ? 'text-success' : 'text-danger'}`}
        >
          {item.status}
        </span>
        <span className="ml-auto text-xs text-muted">
          {item.duration}ms
        </span>
      </div>
      <p className="mt-1 truncate font-mono text-xs text-muted">{item.url}</p>
      <p className="mt-0.5 text-xs text-muted">{formatTime(item.timestamp)}</p>
    </button>
  );
}
