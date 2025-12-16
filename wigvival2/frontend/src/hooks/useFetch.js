import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useFetch(fetcher, deps = [], options = {})
 * - fetcher: async ({ signal, ...opts }) => data
 * - deps: additional deps that retrigger the hook (array)
 * - options: { initialData: any, immediate: boolean }
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const { initialData = null, immediate = true } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  const controllerRef = useRef(null);

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const run = useCallback(
    async (opts = {}) => {
      cancel();
      const ctrl = new AbortController();
      controllerRef.current = ctrl;
      setLoading(true);
      setError(null);

      try {
        // allow fetcher to accept { signal, ...opts }
        const result = await fetcher({ signal: ctrl.signal, ...opts });
        if (mountedRef.current) setData(result);
        return result;
      } catch (err) {
        if (mountedRef.current) setError(err);
        // rethrow so caller can await and handle if wanted
        throw err;
      } finally {
        if (mountedRef.current) setLoading(false);
        // keep controllerRef for possible cancellation caller-side
      }
    },
    // include fetcher and user deps so run updates correctly
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, ...deps]
  );

  useEffect(() => {
    mountedRef.current = true;
    if (immediate) run().catch(() => {});
    return () => {
      mountedRef.current = false;
      cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return { data, loading, error, refetch: run, cancel };
}

