/**
 * Drag handle for resizable panels.
 * @param {object} props
 * @param {(e: React.MouseEvent | React.TouchEvent) => void} props.onDragStart
 * @param {'horizontal' | 'vertical'} [props.orientation]
 * @param {string} [props.className]
 */
export default function ResizeHandle({
  onDragStart,
  orientation = 'horizontal',
  className = '',
}) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-label={isVertical ? 'Resize sidebar' : 'Resize response panel'}
      tabIndex={0}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
      className={`group relative z-10 shrink-0 touch-none transition-colors hover:bg-border active:bg-accent/20 ${
        isVertical
          ? 'flex w-3 cursor-col-resize items-center justify-center border-x border-border bg-surfaceMuted'
          : 'flex h-3 cursor-row-resize items-center justify-center border-y border-border bg-surfaceMuted'
      } ${className}`}
    >
      <span
        className={`rounded-full bg-muted transition-colors group-hover:bg-accent group-active:bg-accent ${
          isVertical ? 'h-10 w-1' : 'h-1 w-10'
        }`}
        aria-hidden
      />
    </div>
  );
}
