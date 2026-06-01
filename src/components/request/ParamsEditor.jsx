import { KeyValueEditor } from '../shared';

/**
 * @param {object} props
 * @param {Array<{ key: string, value: string }>} props.params
 * @param {(params: Array<{ key: string, value: string }>) => void} props.onChange
 */
export default function ParamsEditor({ params, onChange }) {
  return (
    <KeyValueEditor
      rows={params}
      onChange={onChange}
      keyPlaceholder="Param"
      valuePlaceholder="Value"
    />
  );
}
