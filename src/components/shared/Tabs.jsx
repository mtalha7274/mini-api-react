/**
 * @param {object} props
 * @param {{ id: string, label: string, hasError?: boolean }[]} props.tabs
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
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? tab.hasError
                  ? 'border-b-2 border-danger text-danger'
                  : 'border-b-2 border-accent text-accent'
                : tab.hasError
                  ? 'text-danger hover:text-danger'
                  : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
            {tab.hasError && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
                aria-label="has errors"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
