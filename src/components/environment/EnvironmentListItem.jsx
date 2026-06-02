import { InlineRename } from '../shared';
import IconButton from '../shared/IconButton';

/**
 * @param {object} props
 * @param {{ id: string, name: string }} props.environment
 * @param {boolean} props.isSelected
 * @param {() => void} props.onSelect
 * @param {(name: string) => void} props.onRename
 * @param {() => void} props.onDelete
 */
export default function EnvironmentListItem({
  environment,
  isSelected,
  onSelect,
  onRename,
  onDelete,
}) {
  return (
    <div
      className={`group flex items-center gap-1 rounded-lg px-2 py-1.5 transition-colors ${
        isSelected ? 'bg-accent/15' : 'hover:bg-surfaceMuted'
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
        className="min-w-0 flex-1 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <InlineRename
          value={environment.name}
          onCommit={onRename}
          className={`text-sm font-medium ${
            isSelected ? 'text-accent' : 'text-foreground'
          }`}
        />
      </div>
      <span onClick={(e) => e.stopPropagation()}>
        <IconButton
          label={`Delete environment ${environment.name}`}
          variant="ghost"
          onClick={onDelete}
          className="!h-7 !w-7 shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        >
          ×
        </IconButton>
      </span>
    </div>
  );
}
