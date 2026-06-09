import { useCallback } from 'react';
import { AuthFields } from '../shared';
import { formatAuthSummary } from '../../utils/auth';

/**
 * @param {object} props
 * @param {{ type: 'none' | 'bearer', token: string } | null | undefined} [props.collectionAuth]
 * @param {{ mode: 'inherit' | 'override', type: 'none' | 'bearer', token: string }} props.requestAuth
 * @param {(auth: { mode: 'inherit' | 'override', type: 'none' | 'bearer', token: string }) => void} props.onRequestAuthChange
 */
export default function AuthEditor({
  collectionAuth,
  requestAuth,
  onRequestAuthChange,
}) {
  const handleRequestFieldsChange = useCallback(
    (type, token) => {
      onRequestAuthChange({
        ...requestAuth,
        mode: 'override',
        type,
        token,
      });
    },
    [onRequestAuthChange, requestAuth]
  );

  const handleModeChange = useCallback(
    (mode) => {
      onRequestAuthChange({
        ...requestAuth,
        mode: mode === 'override' ? 'override' : 'inherit',
      });
    },
    [onRequestAuthChange, requestAuth]
  );

  const inheritedSummary = formatAuthSummary(collectionAuth);

  return (
    <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
      <h3 className="mb-1 text-sm font-semibold text-foreground">
        Request authorization
      </h3>
      <p className="mb-4 text-xs text-muted">
        Inherit the collection token or override it for this request only.
      </p>

      <fieldset className="mb-4 flex flex-col gap-2 border-0 p-0">
        <legend className="sr-only">Authorization mode</legend>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="auth-mode"
            value="inherit"
            checked={requestAuth.mode === 'inherit'}
            onChange={() => handleModeChange('inherit')}
            className="h-4 w-4 accent-accent"
          />
          Inherit from collection
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="radio"
            name="auth-mode"
            value="override"
            checked={requestAuth.mode === 'override'}
            onChange={() => handleModeChange('override')}
            className="h-4 w-4 accent-accent"
          />
          Override
        </label>
      </fieldset>

      {requestAuth.mode === 'inherit' ? (
        <div className="rounded-md border border-border bg-background px-3 py-2 text-sm text-muted">
          {collectionAuth != null
            ? inheritedSummary
            : 'No collection — open a request saved in a collection to inherit its token.'}
        </div>
      ) : (
        <AuthFields
          idPrefix="request-auth"
          type={requestAuth.type}
          token={requestAuth.token}
          onChange={handleRequestFieldsChange}
        />
      )}
    </section>
  );
}
