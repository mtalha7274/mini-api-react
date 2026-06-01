import { useEffect, useRef, useState } from 'react';
import IconButton from './IconButton';

/**
 * @param {object} props
 * @param {string} props.value
 * @param {(name: string) => void} props.onCommit
 * @param {() => void} [props.onCancel]
 * @param {string} [props.className]
 * @param {string} [props.inputClassName]
 * @param {boolean} [props.showEditButton]
 */
export default function InlineRename({
  value,
  onCommit,
  onCancel,
  className = '',
  inputClassName = '',
  showEditButton = true,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) onCommit(trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    onCancel?.();
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
          if (e.key === 'Escape') {
            e.preventDefault();
            cancel();
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className={`min-w-0 flex-1 rounded border border-accent bg-input px-1.5 py-0.5 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${inputClassName}`}
        aria-label="Rename"
      />
    );
  }

  return (
    <span
      className={`flex min-w-0 flex-1 items-center gap-1 ${className}`}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      <span className="truncate">{value}</span>
      {showEditButton && (
        <span
          className="shrink-0 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <IconButton
            label="Rename"
            variant="ghost"
            onClick={() => setEditing(true)}
            className="!h-7 !w-7"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
            />
          </svg>
          </IconButton>
        </span>
      )}
    </span>
  );
}
