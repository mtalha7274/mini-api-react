/**
 * @param {object} props
 * @param {unknown} props.body
 * @param {Record<string, string>} props.headers
 * @param {number} props.status
 * @param {string} props.statusText
 */
export default function RawViewer({ body, headers, status, statusText }) {
  const raw = JSON.stringify(
    { status, statusText, headers, body },
    null,
    2
  );

  return (
    <pre className="overflow-auto p-4 font-mono text-xs leading-relaxed text-muted">
      {raw}
    </pre>
  );
}
