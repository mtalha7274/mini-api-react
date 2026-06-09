import { KeyValueEditor } from '../shared';

/**
 * @param {object} props
 * @param {Array<{ key: string, value: string }>} props.variables
 * @param {(variables: Array<{ key: string, value: string }>) => void} props.onChange
 */
export default function VariablesEditor({ variables, onChange }) {
  return (
    <KeyValueEditor
      rows={variables}
      onChange={onChange}
      keyPlaceholder="Variable"
      valuePlaceholder="Value"
    />
  );
}
