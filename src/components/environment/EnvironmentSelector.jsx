import SelectChevron from '../shared/SelectChevron';

/**
 * @param {object} props
 * @param {Array<{ id: string, name: string }>} props.environments
 * @param {string} props.activeEnvironmentId
 * @param {(id: string) => void} props.onChange
 */
export default function EnvironmentSelector({
  environments,
  activeEnvironmentId,
  onChange,
}) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <label
        htmlFor="environment-select"
        className="text-xs font-medium uppercase tracking-wide text-muted"
      >
        Environment
      </label>
      <div className="relative w-full sm:w-auto">
        <select
          id="environment-select"
          value={activeEnvironmentId}
          onChange={(e) => onChange(e.target.value)}
          className="select-control-env w-full min-w-0 appearance-none rounded-lg border border-border bg-input py-2 pl-3 text-sm text-foreground focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[148px]"
        >
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.name}
            </option>
          ))}
        </select>
        <SelectChevron />
      </div>
    </div>
  );
}
