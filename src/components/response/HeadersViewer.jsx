/**
 * @param {object} props
 * @param {Record<string, string>} props.headers
 */
export default function HeadersViewer({ headers }) {
  const entries = Object.entries(headers || {});

  return (
    <div className="overflow-auto p-4">
      {entries.length === 0 ? (
        <p className="text-sm text-muted">No headers</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted">
              <th className="pb-2 pr-4 font-medium">Name</th>
              <th className="pb-2 font-medium">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([name, value]) => (
              <tr key={name} className="border-t border-border text-foreground">
                <td className="py-2 pr-4 font-mono text-accent">{name}</td>
                <td className="py-2 font-mono">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
