import EnvironmentListItem from './EnvironmentListItem';
import VariablesEditor from './VariablesEditor';

/**
 * @param {object} props
 * @param {Array<{ id: string, name: string, variables: Array<{ key: string, value: string }> }>} props.environments
 * @param {string | null} props.selectedEnvironmentId
 * @param {() => void} props.onCreateEnvironment
 * @param {(environmentId: string) => void} props.onSelectEnvironment
 * @param {(environmentId: string, name: string) => void} props.onRenameEnvironment
 * @param {(environmentId: string) => void} props.onDeleteEnvironment
 * @param {(environmentId: string, variables: Array<{ key: string, value: string }>) => void} props.onVariablesChange
 */
export default function EnvironmentList({
  environments,
  selectedEnvironmentId,
  onCreateEnvironment,
  onSelectEnvironment,
  onRenameEnvironment,
  onDeleteEnvironment,
  onVariablesChange,
}) {
  const selectedEnv = environments.find((e) => e.id === selectedEnvironmentId);

  return (
    <div className="flex flex-col">
      <div className="border-b border-border p-2">
        <button
          type="button"
          onClick={onCreateEnvironment}
          className="w-full rounded-lg px-2 py-2 text-left text-sm font-medium text-accent transition-colors hover:bg-surfaceMuted hover:text-accent-hover"
        >
          + Environment
        </button>
      </div>
      <div className="space-y-1 p-2">
        {environments.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted">
            No environments yet
          </p>
        ) : (
          environments.map((environment) => (
            <EnvironmentListItem
              key={environment.id}
              environment={environment}
              isSelected={selectedEnvironmentId === environment.id}
              onSelect={() => onSelectEnvironment(environment.id)}
              onRename={(name) => onRenameEnvironment(environment.id, name)}
              onDelete={() => onDeleteEnvironment(environment.id)}
            />
          ))
        )}
      </div>
      {selectedEnv && (
        <div className="border-t border-border p-3">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">
            Variables — {selectedEnv.name}
          </p>
          <VariablesEditor
            variables={selectedEnv.variables}
            onChange={(vars) => onVariablesChange(selectedEnv.id, vars)}
          />
        </div>
      )}
    </div>
  );
}
