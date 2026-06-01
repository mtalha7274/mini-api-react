/**
 * @param {object} props
 * @param {string} props.body
 * @param {(body: string) => void} props.onChange
 * @param {string | null} [props.error]
 */
export default function BodyEditor({ body, onChange, error }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          JSON / Text
        </span>
        {error && (
          <span className="text-xs text-danger" role="alert">
            {error}
          </span>
        )}
      </div>
      <textarea
        value={body}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className={`min-h-[200px] flex-1 resize-y rounded-lg border bg-surfaceMuted p-3 font-mono text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          error ? 'border-danger' : 'border-border'
        }`}
        placeholder='{ "key": "value" }'
        aria-label="Request body"
      />
    </div>
  );
}
