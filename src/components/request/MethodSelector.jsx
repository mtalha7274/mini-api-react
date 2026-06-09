import { HTTP_METHODS } from '../../data/mockData';
import SelectChevron from '../shared/SelectChevron';

const METHOD_BG = {
  GET: 'bg-method-get',
  POST: 'bg-method-post',
  PUT: 'bg-method-put',
  PATCH: 'bg-method-patch',
  DELETE: 'bg-method-delete',
};

/**
 * @param {object} props
 * @param {string} props.method
 * @param {(method: string) => void} props.onChange
 */
export default function MethodSelector({ method, onChange }) {
  const bgClass = METHOD_BG[method] || 'bg-surfaceMuted';

  return (
    <div
      className={`relative w-[108px] min-w-[108px] shrink-0 overflow-hidden rounded-l-lg rounded-r-none shadow-sm ring-1 ring-black/10 dark:ring-white/10 ${bgClass}`}
    >
      <select
        value={method}
        onChange={(e) => onChange(e.target.value)}
        className="select-control-method h-10 w-full cursor-pointer appearance-none border-0 bg-transparent pl-3 pr-9 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
        aria-label="HTTP method"
      >
        {HTTP_METHODS.map((m) => (
          <option key={m} value={m} className="bg-surface text-foreground">
            {m}
          </option>
        ))}
      </select>
      <SelectChevron variant="inverse" />
    </div>
  );
}
