import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

const STORAGE_KEY = 'mini-api-response-height';
const HANDLE_HEIGHT = 12;
const DEFAULT_RATIO = 0.4;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readStoredHeight() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const n = Number(raw);
      if (!Number.isNaN(n) && n > 0) return n;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function writeStoredHeight(px) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.round(px)));
  } catch {
    /* ignore */
  }
}

/**
 * Resize response panel between request tabs (max) and response header bottom (min).
 * @param {React.RefObject<HTMLElement>} mainRef
 * @param {React.RefObject<HTMLElement>} tabsEndRef - bottom edge of Params/Headers/Body tab bar
 * @param {React.RefObject<HTMLElement>} responseHeaderRef - "Response" title bar only
 */
export function useResponseResize(mainRef, tabsEndRef, responseHeaderRef) {
  const [responseHeight, setResponseHeight] = useState(null);

  const measureBounds = useCallback(() => {
    const main = mainRef.current;
    const tabsEnd = tabsEndRef.current;
    const header = responseHeaderRef.current;
    if (!main || !tabsEnd || !header) {
      return null;
    }

    const mainRect = main.getBoundingClientRect();
    const tabsBottom = tabsEnd.getBoundingClientRect().bottom;
    const headerHeight = header.offsetHeight;

    const min = headerHeight;
    const max = mainRect.bottom - tabsBottom - HANDLE_HEIGHT;
    const defaultH = clamp(
      (mainRect.bottom - tabsBottom) * DEFAULT_RATIO,
      min,
      Math.max(min, max)
    );

    return {
      min,
      max: Math.max(min, max),
      defaultH,
    };
  }, [mainRef, tabsEndRef, responseHeaderRef]);

  const applyHeight = useCallback(
    (next) => {
      const bounds = measureBounds();
      if (!bounds) return;
      const clamped = clamp(next, bounds.min, bounds.max);
      setResponseHeight(clamped);
      writeStoredHeight(clamped);
    },
    [measureBounds]
  );

  const syncHeight = useCallback(() => {
    const bounds = measureBounds();
    if (!bounds) return;
    setResponseHeight((prev) => {
      if (prev == null) {
        const stored = readStoredHeight();
        return stored != null
          ? clamp(stored, bounds.min, bounds.max)
          : bounds.defaultH;
      }
      return clamp(prev, bounds.min, bounds.max);
    });
  }, [measureBounds]);

  useLayoutEffect(() => {
    syncHeight();
  }, [syncHeight]);

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(syncHeight);
      observer.observe(main);
      const tabsEl = tabsEndRef.current;
      if (tabsEl) observer.observe(tabsEl);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', syncHeight);
    return () => window.removeEventListener('resize', syncHeight);
  }, [mainRef, tabsEndRef, syncHeight]);

  const startDrag = useCallback(
    (e) => {
      e.preventDefault();
      const main = mainRef.current;
      if (!main) return;

      const getClientY = (ev) =>
        'touches' in ev && ev.touches.length > 0
          ? ev.touches[0].clientY
          : ev.clientY;

      const onMove = (moveEvent) => {
        if ('touches' in moveEvent) moveEvent.preventDefault();
        const mainRect = main.getBoundingClientRect();
        const fromBottom = mainRect.bottom - getClientY(moveEvent);
        applyHeight(fromBottom);
      };

      const onEnd = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
      onMove(e);
    },
    [mainRef, applyHeight]
  );

  return {
    responseHeight: responseHeight ?? 240,
    startDrag,
  };
}
