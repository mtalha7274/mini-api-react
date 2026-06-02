/**
 * Horizontal drag handle between editor and response panels.
 * @param {object} props
 * @param {(e: React.MouseEvent | React.TouchEvent) => void} props.onDragStart
 */
export default function ResizeHandle({ onDragStart }) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="Resize response panel"
      tabIndex={0}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      className="group relative z-10 flex h-3 shrink-0 cursor-row-resize touch-none items-center justify-center border-y border-border bg-surfaceMuted transition-colors hover:bg-border active:bg-accent/20"
    >
      <span
        className="h-1 w-10 rounded-full bg-muted transition-colors group-hover:bg-accent group-active:bg-accent"
        aria-hidden
      />
    </div>
  );
}
