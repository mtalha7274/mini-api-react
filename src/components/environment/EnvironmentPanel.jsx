import { useState } from 'react';
import EnvironmentSelector from './EnvironmentSelector';
import VariablesEditor from './VariablesEditor';

/**
 * @param {object} props
 * @param {Array<{ id: string, name: string, variables: Array<{ key: string, value: string }> }>} props.environments
 * @param {string} props.activeEnvironmentId
 * @param {(id: string) => void} props.onEnvironmentChange
 * @param {(envId: string, variables: Array<{ key: string, value: string }>) => void} props.onVariablesChange
 */
export default function EnvironmentPanel({
  environments,
  activeEnvironmentId,
  onEnvironmentChange,
  onVariablesChange,
}) {
  const [showVariables, setShowVariables] = useState(false);

  const activeEnv = environments.find((e) => e.id === activeEnvironmentId);

  return (
    <div className="border-b border-border bg-surface px-3 py-3 shadow-card sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <EnvironmentSelector
          environments={environments}
          activeEnvironmentId={activeEnvironmentId}
          onChange={onEnvironmentChange}
        />
        <button
          type="button"
          onClick={() => setShowVariables((v) => !v)}
          className="text-left text-sm font-medium text-accent transition-colors hover:text-accent-hover sm:text-right"
        >
          {showVariables ? 'Hide variables' : 'Edit variables'}
        </button>
      </div>
      {showVariables && activeEnv && (
        <div className="mt-4 w-full max-w-2xl">
          <VariablesEditor
            variables={activeEnv.variables}
            onChange={(vars) =>
              onVariablesChange(activeEnvironmentId, vars)
            }
          />
        </div>
      )}
    </div>
  );
}
