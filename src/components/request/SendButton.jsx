/**
 * @param {object} props
 * @param {() => void} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]
 */
export default function SendButton({ onClick, disabled = true, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title="Request execution is planned for Phase 3"
      className={`h-10 shrink-0 rounded-lg bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      Send
    </button>
  );
}
