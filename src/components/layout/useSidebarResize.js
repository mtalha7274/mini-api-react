import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

const STORAGE_KEY = 'mini-api-sidebar-width';
const HANDLE_WIDTH = 12;
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readStoredWidth() {
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

function writeStoredWidth(px) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.round(px)));
  } catch {
    /* ignore */
  }
}

/**
 * Resize sidebar width on desktop (lg+). Parent sets --sidebar-width CSS variable.
 * @param {React.RefObject<HTMLElement>} shellRef
 */
export function useSidebarResize(shellRef) {
  const [sidebarWidth, setSidebarWidth] = useState(null);

  const measureBounds = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) return null;

    const shellWidth = shell.getBoundingClientRect().width;
    const max = Math.min(
      MAX_WIDTH,
      Math.floor(shellWidth * 0.5) - HANDLE_WIDTH
    );
    const min = MIN_WIDTH;
    const defaultW = clamp(DEFAULT_WIDTH, min, Math.max(min, max));

    return {
      min,
      max: Math.max(min, max),
      defaultW,
    };
  }, [shellRef]);

  const applyWidth = useCallback(
    (next) => {
      const bounds = measureBounds();
      if (!bounds) return;
      const clamped = clamp(next, bounds.min, bounds.max);
      setSidebarWidth(clamped);
      writeStoredWidth(clamped);
    },
    [measureBounds]
  );

  const syncWidth = useCallback(() => {
    const bounds = measureBounds();
    if (!bounds) return;
    setSidebarWidth((prev) => {
      if (prev == null) {
        const stored = readStoredWidth();
        return stored != null
          ? clamp(stored, bounds.min, bounds.max)
          : bounds.defaultW;
      }
      return clamp(prev, bounds.min, bounds.max);
    });
  }, [measureBounds]);

  useLayoutEffect(() => {
    syncWidth();
  }, [syncWidth]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return undefined;

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(syncWidth);
      observer.observe(shell);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', syncWidth);
    return () => window.removeEventListener('resize', syncWidth);
  }, [shellRef, syncWidth]);

  const startDrag = useCallback(
    (e) => {
      e.preventDefault();
      const shell = shellRef.current;
      if (!shell) return;

      const getClientX = (ev) =>
        'touches' in ev && ev.touches.length > 0
          ? ev.touches[0].clientX
          : ev.clientX;

      const onMove = (moveEvent) => {
        if ('touches' in moveEvent) moveEvent.preventDefault();
        const shellRect = shell.getBoundingClientRect();
        const fromLeft = getClientX(moveEvent) - shellRect.left;
        applyWidth(fromLeft);
      };

      const onEnd = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onEnd);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onMove, { passive: false });
      window.addEventListener('touchend', onEnd);
      onMove(e);
    },
    [shellRef, applyWidth]
  );

  return {
    sidebarWidth: sidebarWidth ?? DEFAULT_WIDTH,
    startDrag,
  };
}
