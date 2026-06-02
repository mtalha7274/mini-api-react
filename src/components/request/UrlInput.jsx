/**
 * @param {object} props
 * @param {string} props.url
 * @param {(url: string) => void} props.onChange
 */
export default function UrlInput({ url, onChange }) {
  return (
    <input
      type="text"
      value={url}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Enter request URL (supports {{VAR}})"
      className="box-border h-10 min-h-10 min-w-0 flex-1 rounded-l-none rounded-r-lg border border-border border-l-0 bg-input px-3 py-0 text-sm leading-10 text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Request URL"
    />
  );
}
