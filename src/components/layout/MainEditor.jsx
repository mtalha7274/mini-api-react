import { EnvironmentPanel } from '../environment';
import { RequestBuilder } from '../request';

/**
 * @param {object} props
 * @param {object} props.environmentProps
 * @param {object} props.requestProps
 */
export default function MainEditor({ environmentProps, requestProps }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background transition-colors duration-200">
      <EnvironmentPanel {...environmentProps} />
      <div className="min-h-0 flex-1 overflow-hidden">
        <RequestBuilder {...requestProps} />
      </div>
    </section>
  );
}
