import { CollectionList } from '../collections';
import { EnvironmentList } from '../environment';
import { AppLogo, ThemeToggle } from '../shared';
import IconButton from '../shared/IconButton';

const SIDEBAR_TABS = [
  { id: 'collections', label: 'Collections' },
  { id: 'environments', label: 'Environments' },
];

/**
 * @param {object} props
 * @param {string} [props.id]
 * @param {boolean} props.isOpen
 * @param {() => void} [props.onClose]
 * @param {'collections' | 'environments'} props.activeTab
 * @param {(tab: string) => void} props.onTabChange
 * @param {object} props.collectionsProps
 * @param {object} props.environmentsProps
 */
export default function Sidebar({
  id = 'app-sidebar',
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  collectionsProps,
  environmentsProps,
}) {
  return (
    <aside
      id={id}
      className={`fixed inset-y-0 left-0 z-40 flex w-[min(280px,88vw)] flex-col border-r border-border bg-surface transition-transform duration-200 ease-out lg:static lg:z-auto lg:h-full lg:w-[var(--sidebar-width,280px)] lg:min-w-[200px] lg:max-w-[min(480px,50vw)] lg:shrink-0 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="hidden items-center justify-between gap-2 border-b border-border px-3 py-3 lg:flex">
        <AppLogo size="lg" />
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-between border-b border-border px-3 py-2 lg:hidden">
        <AppLogo size="sm" />
        {onClose && (
          <IconButton label="Close sidebar" variant="ghost" onClick={onClose}>
            ×
          </IconButton>
        )}
      </div>

      <div className="flex border-b border-border" role="tablist">
        {SIDEBAR_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              activeTab === tab.id
                ? 'border-b-2 border-accent text-accent'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'collections' && (
          <CollectionList {...collectionsProps} />
        )}
        {activeTab === 'environments' && (
          <EnvironmentList {...environmentsProps} />
        )}
      </div>
    </aside>
  );
}
