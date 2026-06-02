/**
 * @param {object} props
 * @param {unknown} props.body
 */
export default function BodyViewer({ body }) {
  const formatted =
    typeof body === 'string'
      ? body
      : JSON.stringify(body, null, 2);

  return (
    <pre className="overflow-auto p-4 font-mono text-sm leading-relaxed text-syntax">
      {formatted}
    </pre>
  );
}
