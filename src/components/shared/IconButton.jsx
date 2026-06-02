/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.label] - Accessible label
 * @param {() => void} [props.onClick]
 * @param {boolean} [props.disabled]
 * @param {'default' | 'danger' | 'ghost'} [props.variant]
 * @param {string} [props.className]
 */
export default function IconButton({
  children,
  label,
  onClick,
  disabled = false,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default:
      'bg-surfaceMuted text-foreground hover:bg-border disabled:opacity-50',
    danger:
      'bg-danger/15 text-danger hover:bg-danger/25 disabled:opacity-50',
    ghost:
      'bg-transparent text-muted hover:bg-surfaceMuted hover:text-foreground',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
