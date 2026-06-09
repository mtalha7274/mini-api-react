import { useState } from 'react';
import { Tabs } from '../shared';
import StatusBar from './StatusBar';
import BodyViewer from './BodyViewer';
import HeadersViewer from './HeadersViewer';
import RawViewer from './RawViewer';

const RESPONSE_TABS = [
  { id: 'body', label: 'Body' },
  { id: 'headers', label: 'Headers' },
  { id: 'raw', label: 'Raw' },
];

/**
 * @param {object} props
 * @param {{ status: number, statusText: string, duration: number, headers: object, body: unknown }} props.response
 */
export default function ResponseViewer({ response }) {
  const [activeTab, setActiveTab] = useState('body');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text =
      typeof response.body === 'string'
        ? response.body
        : JSON.stringify(response.body, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-surface transition-colors duration-200">
      <StatusBar
        status={response.status}
        statusText={response.statusText}
        duration={response.duration}
      />
      <div className="flex items-center justify-between">
        <Tabs
          tabs={RESPONSE_TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === 'body' && (
          <button
            type="button"
            onClick={handleCopy}
            className="mr-3 text-xs font-medium text-muted transition-colors hover:text-accent"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surfaceMuted">
        {activeTab === 'body' && <BodyViewer body={response.body} />}
        {activeTab === 'headers' && (
          <HeadersViewer headers={response.headers} />
        )}
        {activeTab === 'raw' && (
          <RawViewer
            body={response.body}
            headers={response.headers}
            status={response.status}
            statusText={response.statusText}
          />
        )}
      </div>
    </div>
  );
}
