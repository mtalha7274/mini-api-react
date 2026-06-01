import IconButton from './IconButton';

/**
 * @param {object} props
 * @param {Array<{ key: string, value: string }>} props.rows
 * @param {(rows: Array<{ key: string, value: string }>) => void} props.onChange
 * @param {string} [props.keyPlaceholder]
 * @param {string} [props.valuePlaceholder]
 * @param {boolean} [props.readOnly]
 */
export default function KeyValueEditor({
  rows,
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  readOnly = false,
}) {
  const inputClass =
    'w-full rounded-lg border border-border bg-input px-2 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  const updateRow = (index, field, value) => {
    const next = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    onChange(next);
  };

  const addRow = () => {
    onChange([...rows, { key: '', value: '' }]);
  };

  const removeRow = (index) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="hidden gap-2 text-xs font-medium uppercase tracking-wide text-muted sm:grid sm:grid-cols-[1fr_1fr_auto]">
        <span>{keyPlaceholder}</span>
        <span>{valuePlaceholder}</span>
        <span className="w-8" />
      </div>
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
        >
          <input
            type="text"
            value={row.key}
            readOnly={readOnly}
            placeholder={keyPlaceholder}
            onChange={(e) => updateRow(index, 'key', e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            value={row.value}
            readOnly={readOnly}
            placeholder={valuePlaceholder}
            onChange={(e) => updateRow(index, 'value', e.target.value)}
            className={inputClass}
          />
          {!readOnly && (
            <IconButton
              label="Remove row"
              variant="ghost"
              onClick={() => removeRow(index)}
              className="justify-self-start sm:justify-self-auto"
            >
              ×
            </IconButton>
          )}
          {readOnly && <span className="hidden w-8 sm:block" />}
        </div>
      ))}
      {!readOnly && (
        <button
          type="button"
          onClick={addRow}
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          + Add row
        </button>
      )}
    </div>
  );
}
