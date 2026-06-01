import HistoryItem from './HistoryItem';

/**
 * @param {object} props
 * @param {object[]} props.history
 * @param {string | null} props.activeHistoryId
 * @param {(id: string) => void} props.onSelect
 */
export default function HistoryList({ history, activeHistoryId, onSelect }) {
  if (history.length === 0) {
    return (
      <p className="p-4 text-center text-sm text-muted">No history yet</p>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {history.map((item) => (
        <HistoryItem
          key={item.id}
          item={item}
          isActive={activeHistoryId === item.id}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}
