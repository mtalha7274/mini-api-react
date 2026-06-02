import { useCallback } from 'react';
import { AuthFields } from '../shared';
import { normalizeAuth } from '../../utils/auth';
import { downloadCollectionJson } from '../../utils/collectionExport';

/**
 * @param {object} props
 * @param {{ id: string, name: string, environmentId: string | null, auth: object, requests: object[] }} props.collection
 * @param {string | null} [props.environmentName]
 * @param {(auth: { type: 'none' | 'bearer', token: string }) => void} props.onAuthChange
 */
export default function CollectionDetailView({
  collection,
  environmentName,
  onAuthChange,
}) {
  const auth = normalizeAuth(collection.auth, 'collection');

  const handleAuthChange = useCallback(
    (type, token) => {
      onAuthChange({ type, token });
    },
    [onAuthChange]
  );

  const handleExport = useCallback(() => {
    downloadCollectionJson(collection);
  }, [collection]);

  const requestCount = collection.requests.length;
  const requestLabel = `${requestCount} request${requestCount === 1 ? '' : 's'}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border bg-surface px-4 py-4 shadow-card sm:px-6">
        <h1 className="truncate text-lg font-semibold text-foreground">
          {collection.name}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {requestLabel}
          {environmentName ? (
            <>
              <span className="mx-1.5" aria-hidden>
                ·
              </span>
              Environment: {environmentName}
            </>
          ) : null}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-background p-4 sm:p-6">
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
            <h2 className="mb-1 text-sm font-semibold text-foreground">
              Authorization
            </h2>
            <p className="mb-4 text-xs text-muted">
              Default Bearer token for requests that inherit authorization from
              this collection.
            </p>
            <AuthFields
              idPrefix="collection-auth"
              type={auth.type}
              token={auth.token}
              onChange={handleAuthChange}
            />
          </section>

          <section className="rounded-lg border border-border bg-surface p-4 shadow-card">
            <h2 className="mb-1 text-sm font-semibold text-foreground">
              Export
            </h2>
            <p className="mb-4 text-xs text-muted">
              Download this collection as JSON, including all requests and
              settings.
            </p>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surfaceMuted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Export as JSON
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
