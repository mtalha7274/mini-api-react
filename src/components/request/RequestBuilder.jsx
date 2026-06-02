import { useCallback, useMemo, useState } from 'react';
import { canSendRequest } from '../../lib/http/canSendRequest';
import {
  bodyRequiresJsonValidation,
  getJsonValidationError,
} from '../../utils/jsonValidation';
import { Tabs } from '../shared';
import MethodSelector from './MethodSelector';
import UrlInput from './UrlInput';
import HeadersEditor from './HeadersEditor';
import ParamsEditor from './ParamsEditor';
import AuthEditor from './AuthEditor';
import BodyEditor from './BodyEditor';
import SendButton from './SendButton';

const REQUEST_TABS = [
  { id: 'params', label: 'Params' },
  { id: 'auth', label: 'Authorization' },
  { id: 'headers', label: 'Headers' },
  { id: 'body', label: 'Body' },
];

/**
 * @param {object} props
 * @param {string} props.method
 * @param {string} props.url
 * @param {Array<{ key: string, value: string }>} props.headers
 * @param {Array<{ key: string, value: string }>} props.params
 * @param {string} props.body
 * @param {{ type: 'none' | 'bearer', token: string } | null | undefined} [props.collectionAuth]
 * @param {{ mode: 'inherit' | 'override', type: 'none' | 'bearer', token: string }} props.requestAuth
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
  collectionAuth,
  requestAuth,
  envVariableMap,
  onChange,
  onSend,
  isSending = false,
  tabsEndRef,
}) {
  const [activeTab, setActiveTab] = useState('params');

  const bodyJsonError = useMemo(() => {
    if (!bodyRequiresJsonValidation(method, body)) return null;
    return getJsonValidationError(body);
  }, [method, body]);

  const sendEnabled = useMemo(
    () => canSendRequest({ method, url, body }),
    [method, url, body]
  );

  const tabs = useMemo(
    () =>
      REQUEST_TABS.map((tab) =>
        tab.id === 'body' && bodyJsonError
          ? { ...tab, label: 'Body', hasError: true }
          : tab
      ),
    [bodyJsonError]
  );

  const handleSend = useCallback(() => {
    if (bodyJsonError) {
      setActiveTab('body');
      return;
    }
    onSend?.();
  }, [bodyJsonError, onSend]);

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
            onClick={handleSend}
            disabled={!sendEnabled}
            loading={isSending}
            className="w-full shrink-0 sm:w-auto"
          />
        </div>
      </div>

      <div ref={tabsEndRef} className="shrink-0">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-background p-3 sm:p-4">
        {activeTab === 'params' && (
          <ParamsEditor
            params={params}
            onChange={(value) => onChange('params', value)}
          />
        )}
        {activeTab === 'auth' && (
          <AuthEditor
            collectionAuth={collectionAuth}
            requestAuth={requestAuth}
            onRequestAuthChange={(value) => onChange('auth', value)}
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
            error={bodyJsonError}
          />
        )}
      </div>
    </div>
  );
}
