import { ThemeToggle } from '../shared';

/**
 * @param {object} props
 * @param {boolean} props.sidebarOpen
 * @param {() => void} props.onOpenSidebar
 */
export default function MobileHeader({ sidebarOpen, onOpenSidebar }) {
  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-border bg-surface px-3 py-2.5 lg:hidden">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open sidebar"
        aria-expanded={sidebarOpen}
        aria-controls="app-sidebar"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surfaceMuted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-5 w-5"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
          Mini API
        </h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
