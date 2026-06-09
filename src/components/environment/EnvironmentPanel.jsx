import { useState } from 'react';
import VariablesEditor from './VariablesEditor';

/**
 * @param {object} props
 * @param {{ id: string, name: string, variables: Array<{ key: string, value: string }> } | null} props.resolvedEnvironment
 * @param {(environmentId: string, variables: Array<{ key: string, value: string }>) => void} [props.onVariablesChange]
 */
export default function EnvironmentPanel({
  resolvedEnvironment,
  onVariablesChange,
}) {
  const [showVariables, setShowVariables] = useState(false);

  const canEdit = !!resolvedEnvironment && !!onVariablesChange;

  const handleVariablesChange = (variables) => {
    if (resolvedEnvironment && onVariablesChange) {
      onVariablesChange(resolvedEnvironment.id, variables);
    }
  };

  if (!resolvedEnvironment) {
    return null;
  }

  return (
    <div className="border-b border-border border-l-4 border-l-env bg-surface px-3 py-3 shadow-card sm:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="min-w-0 truncate text-sm font-medium text-foreground">
          <span className="text-muted">Environment</span>
          <span className="mx-1.5 text-muted" aria-hidden>
            ·
          </span>
          <span className="font-semibold text-env">{resolvedEnvironment.name}</span>
        </p>
        {canEdit && (
          <button
            type="button"
            onClick={() => setShowVariables((v) => !v)}
            className="shrink-0 text-left text-sm font-medium text-accent transition-colors hover:text-accent-hover sm:text-right"
          >
            {showVariables ? 'Hide variables' : 'Edit variables'}
          </button>
        )}
      </div>
      {showVariables && canEdit && (
        <div
          id="collection-env-variables"
          aria-label={`${resolvedEnvironment.name} environment variables`}
          className="mt-4 w-full max-w-3xl"
        >
          <VariablesEditor
            variables={resolvedEnvironment.variables}
            onChange={handleVariablesChange}
          />
        </div>
      )}
    </div>
  );
}
