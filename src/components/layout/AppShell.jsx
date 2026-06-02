import Sidebar from './Sidebar';
import MainColumn from './MainColumn';
import MobileHeader from './MobileHeader';

/**
 * @param {object} props
 * @param {boolean} props.sidebarOpen
 * @param {() => void} props.onOpenSidebar
 * @param {() => void} props.onCloseSidebar
 * @param {object} props.sidebarProps
 * @param {object} props.environmentProps
 * @param {object} props.requestProps
 * @param {object} props.response
 */
export default function AppShell({
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  sidebarProps,
  environmentProps,
  requestProps,
  response,
}) {
  return (
    <div className="flex h-dvh min-h-0 flex-col bg-background transition-colors duration-200 lg:grid lg:grid-cols-[280px_1fr] lg:grid-rows-1">
      <MobileHeader
        sidebarOpen={sidebarOpen}
        onOpenSidebar={onOpenSidebar}
      />

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          aria-label="Dismiss sidebar"
          onClick={onCloseSidebar}
        />
      )}

      <Sidebar
        id="app-sidebar"
        isOpen={sidebarOpen}
        onClose={onCloseSidebar}
        {...sidebarProps}
      />

      <MainColumn
        environmentProps={environmentProps}
        requestProps={requestProps}
        response={response}
      />
    </div>
  );
}
