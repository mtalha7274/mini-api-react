/**
 * @param {object} props
 * @param {'default' | 'inverse'} [props.variant]
 * @param {'default' | 'compact'} [props.size]
 */
export default function SelectChevron({ variant = 'default', size = 'default' }) {
  const position =
    size === 'compact' ? 'right-1 top-1/2' : 'right-2.5 top-1/2';
  const iconSize = size === 'compact' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <span
      className={`pointer-events-none absolute -translate-y-1/2 ${position} ${
        variant === 'inverse' ? 'text-white/90' : 'text-muted'
      }`}
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className={iconSize}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}
