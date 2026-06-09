function statusColor(status) {
  if (status >= 200 && status < 300) return 'text-success';
  if (status >= 400) return 'text-danger';
  return 'text-warning';
}

/**
 * @param {object} props
 * @param {number} props.status
 * @param {string} props.statusText
 * @param {number} props.duration
 */
export default function StatusBar({ status, statusText, duration }) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border bg-surfaceMuted px-4 py-2 text-sm">
      <span className={`font-bold ${statusColor(status)}`}>
        {status} {statusText}
      </span>
      <span className="text-muted">Time: {duration} ms</span>
    </div>
  );
}
