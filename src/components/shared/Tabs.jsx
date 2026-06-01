/**
 * @param {object} props
 * @param {{ id: string, label: string }[]} props.tabs
 * @param {string} props.activeTab
 * @param {(tabId: string) => void} props.onChange
 */
export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div
      className="flex gap-1 overflow-x-auto border-b border-border bg-surfaceMuted px-2"
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`shrink-0 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
