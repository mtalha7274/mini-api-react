import { KeyValueEditor } from '../shared';

/**
 * @param {object} props
 * @param {Array<{ key: string, value: string }>} props.headers
 * @param {(headers: Array<{ key: string, value: string }>) => void} props.onChange
 */
export default function HeadersEditor({ headers, onChange }) {
  return (
    <KeyValueEditor
      rows={headers}
      onChange={onChange}
      keyPlaceholder="Header"
      valuePlaceholder="Value"
    />
  );
}
