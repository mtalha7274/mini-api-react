import { useRef } from 'react';
import { EnvironmentPanel } from '../environment';
import { RequestBuilder } from '../request';
import ResponsePanel from './ResponsePanel';
import ResizeHandle from './ResizeHandle';
import { useResponseResize } from './useResponseResize';

/**
 * @param {object} props
 * @param {object} props.environmentProps
 * @param {object} props.requestProps
 * @param {object} props.response
 */
export default function MainColumn({
  environmentProps,
  requestProps,
  response,
}) {
  const mainRef = useRef(null);
  const tabsEndRef = useRef(null);
  const responseHeaderRef = useRef(null);

  const { responseHeight, startDrag } = useResponseResize(
    mainRef,
    tabsEndRef,
    responseHeaderRef
  );

  return (
    <main
      ref={mainRef}
      className="flex min-h-0 flex-1 flex-col overflow-hidden lg:shadow-card"
    >
      <EnvironmentPanel {...environmentProps} />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <RequestBuilder {...requestProps} tabsEndRef={tabsEndRef} />

        <ResizeHandle onDragStart={startDrag} />

        <ResponsePanel
          response={response}
          height={responseHeight}
          headerRef={responseHeaderRef}
        />
      </div>
    </main>
  );
}
