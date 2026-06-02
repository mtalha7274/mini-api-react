/** Wavy red underline — extra viewBox padding so stroke is not clipped */
const SQUIGGLE_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5' viewBox='0 0 8 5'%3E%3Cpath d='M0 3.5 Q2 1.5 4 3.5 T8 3.5' fill='none' stroke='%23b91c1c' stroke-width='1.25' stroke-linecap='round'/%3E%3C/svg%3E";

const SQUIGGLE_HEIGHT = 5;

/**
 * @param {object} props
 * @param {{ top: number, left: number, lineHeight: number, charWidth: number, squiggleTop: number, lineCenter: number }} props.position
 * @param {number} props.scrollTop
 * @param {number} props.scrollLeft
 * @param {string} props.message
 * @param {string} [props.describedById]
 */
export default function JsonErrorMarker({
  position,
  scrollTop,
  scrollLeft,
  message,
  describedById,
}) {
  const squiggleLeft = position.left - scrollLeft;
  const squiggleTop = position.squiggleTop - scrollTop;
  const lineCenter = position.lineCenter - scrollTop;

  const squiggleWidth = Math.max(position.charWidth, 8);

  return (
    <>
      <span id={describedById} className="sr-only">
        {message}
      </span>

      {/* Inline squiggle under error column */}
      <span
        aria-hidden
        className="pointer-events-none absolute overflow-visible"
        style={{
          top: squiggleTop,
          left: squiggleLeft,
          width: squiggleWidth,
          height: SQUIGGLE_HEIGHT,
          backgroundImage: `url("${SQUIGGLE_SVG}")`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: `8px ${SQUIGGLE_HEIGHT}px`,
          backgroundPosition: 'left bottom',
        }}
      />

      {/* Invisible hover target for tooltip near squiggle */}
      <span
        className="pointer-events-auto absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-help"
        style={{
          top: lineCenter,
          left: squiggleLeft + squiggleWidth / 2,
        }}
        title={message}
        aria-label={message}
      />
    </>
  );
}
