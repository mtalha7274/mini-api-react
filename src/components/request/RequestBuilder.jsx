import { useMemo, useState } from 'react';
import { canSendRequest } from '../../lib/http/canSendRequest';
import { Tabs } from '../shared';
import MethodSelector from './MethodSelector';
import UrlInput from './UrlInput';
import HeadersEditor from './HeadersEditor';
import ParamsEditor from './ParamsEditor';
import BodyEditor from './BodyEditor';
import SendButton from './SendButton';

const REQUEST_TABS = [
  { id: 'params', label: 'Params' },
  { id: 'headers', label: 'Headers' },
  { id: 'body', label: 'Body' },
];

function validateJson(body) {
  if (!body.trim()) return null;
  try {
    JSON.parse(body);
    return null;
  } catch {
    return 'Invalid JSON';
  }
}

/**
 * @param {object} props
 * @param {string} props.method
 * @param {string} props.url
 * @param {Array<{ key: string, value: string }>} props.headers
 * @param {Array<{ key: string, value: string }>} props.params
 * @param {string} props.body
 * @param {Record<string, string>} [props.envVariableMap]
 * @param {(field: string, value: unknown) => void} props.onChange
 * @param {() => void} [props.onSend]
 * @param {boolean} [props.isSending]
 * @param {React.RefObject<HTMLElement>} [props.tabsEndRef] - clamp anchor below tab bar
 */
export default function RequestBuilder({
  method,
  url,
  headers,
  params,
  body,
  envVariableMap,
  onChange,
  onSend,
  isSending = false,
  tabsEndRef,
}) {
  const [activeTab, setActiveTab] = useState('params');
  const bodyError = useMemo(
    () => (activeTab === 'body' ? validateJson(body) : null),
    [activeTab, body]
  );
  const sendEnabled = useMemo(
    () => canSendRequest({ method, url, body }),
    [method, url, body]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-border bg-surface p-3 shadow-card">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex w-full min-w-0 flex-row items-stretch overflow-hidden rounded-lg shadow-card sm:min-w-0 sm:flex-1">
            <MethodSelector
              method={method}
              onChange={(value) => onChange('method', value)}
            />
            <UrlInput
              url={url}
              envVariableMap={envVariableMap}
              onChange={(value) => onChange('url', value)}
            />
          </div>
          <SendButton
            onClick={onSend}
            disabled={!sendEnabled}
            loading={isSending}
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      </div>

      <div ref={tabsEndRef} className="shrink-0">
        <Tabs tabs={REQUEST_TABS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-background p-3 sm:p-4">
        {activeTab === 'params' && (
          <ParamsEditor
            params={params}
            onChange={(value) => onChange('params', value)}
          />
        )}
        {activeTab === 'headers' && (
          <HeadersEditor
            headers={headers}
            onChange={(value) => onChange('headers', value)}
          />
        )}
        {activeTab === 'body' && (
          <BodyEditor
            body={body}
            onChange={(value) => onChange('body', value)}
            error={bodyError}
          />
        )}
      </div>
    </div>
  );
}
