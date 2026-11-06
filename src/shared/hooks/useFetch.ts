import { useEffect, useRef, useState } from 'react';

type State<T> = { key: string; data: T } | { key: string; error: true };

export function useFetch<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<State<T> | null>(null);
  const loader = useRef(load);
  const fullKey = `${key}|${attempt}`;

  useEffect(() => {
    loader.current = load;
  });

  useEffect(() => {
    const controller = new AbortController();
    loader.current(controller.signal)
      .then(data => setState({ key: fullKey, data }))
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ key: fullKey, error: true });
        }
      });
    return () => controller.abort();
  }, [fullKey]);

  const fresh = state?.key === fullKey;
  return {
    data: state && 'data' in state ? state.data : null,
    loading: !fresh,
    failed: fresh && state !== null && 'error' in state,
    retry: () => setAttempt(n => n + 1),
  };
}
