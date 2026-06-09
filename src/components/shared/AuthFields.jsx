import { useCallback } from 'react';
import SelectChevron from './SelectChevron';

const AUTH_TYPES = [
  { value: 'none', label: 'No Auth' },
  { value: 'bearer', label: 'Bearer Token' },
];

const SELECT_CLASS =
  'select-control h-9 w-full max-w-xs cursor-pointer appearance-none rounded-lg border border-border bg-surface pl-3 pr-9 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const INPUT_CLASS =
  'h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/**
 * @param {object} props
 * @param {'none' | 'bearer'} props.type
 * @param {string} props.token
 * @param {(type: 'none' | 'bearer', token: string) => void} props.onChange
 * @param {string} [props.idPrefix]
 */
export default function AuthFields({ type, token, onChange, idPrefix = 'auth' }) {
  const handleTypeChange = useCallback(
    (e) => {
      const nextType = e.target.value === 'bearer' ? 'bearer' : 'none';
      onChange(nextType, token);
    },
    [onChange, token]
  );

  const handleTokenChange = useCallback(
    (e) => {
      onChange(type, e.target.value);
    },
    [onChange, type]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-w-xs flex-col gap-1.5">
        <label
          htmlFor={`${idPrefix}-type`}
          className="text-xs font-medium text-muted"
        >
          Type
        </label>
        <div className="relative">
          <select
            id={`${idPrefix}-type`}
            value={type}
            onChange={handleTypeChange}
            className={SELECT_CLASS}
          >
            {AUTH_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>
      </div>

      {type === 'bearer' && (
        <div className="flex max-w-xl flex-col gap-1.5">
          <label
            htmlFor={`${idPrefix}-token`}
            className="text-xs font-medium text-muted"
          >
            Token
          </label>
          <input
            id={`${idPrefix}-token`}
            type="text"
            value={token}
            onChange={handleTokenChange}
            placeholder="Enter token or {{VAR}}"
            className={INPUT_CLASS}
            autoComplete="off"
            spellCheck={false}
          />
          <p className="text-xs text-muted">
            Sent as{' '}
            <code className="rounded bg-surfaceMuted px-1 py-0.5 font-mono text-[11px]">
              Authorization: Bearer &lt;token&gt;
            </code>
            . Supports {'{{VAR}}'} substitution.
          </p>
        </div>
      )}
    </div>
  );
}
