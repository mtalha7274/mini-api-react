import { useMemo } from 'react';
import { tokenizeJsonText } from '../../utils/jsonHighlight';

const TOKEN_CLASS = {
  plain: 'text-foreground',
  punctuation: 'text-json-punctuation',
  key: 'text-json-key',
  string: 'text-json-string',
  number: 'text-json-number',
  boolean: 'text-json-boolean',
  null: 'text-json-null',
};

/**
 * @param {object} props
 * @param {string} props.text
 * @param {string} [props.className]
 * @param {string} [props.placeholder]
 */
export default function JsonHighlightLayer({
  text,
  className = '',
  placeholder,
}) {
  const tokens = useMemo(() => tokenizeJsonText(text), [text]);

  if (!text && placeholder) {
    return (
      <pre className={className} aria-hidden>
        <span className="text-muted">{placeholder}</span>
      </pre>
    );
  }

  return (
    <pre className={className} aria-hidden>
      {tokens.map((token, index) => (
        <span key={index} className={TOKEN_CLASS[token.type]}>
          {token.text}
        </span>
      ))}
    </pre>
  );
}
