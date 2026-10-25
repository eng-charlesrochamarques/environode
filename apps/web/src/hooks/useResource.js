import { useCallback, useEffect, useRef, useState } from "react";

export function useResource(load, onUnauthorized) {
  const requestId = useRef(0);
  const hasLoaded = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    const currentId = ++requestId.current;
    if (hasLoaded.current) setRefreshing(true);
    else setLoading(true);
    try {
      const result = await load();
      if (currentId !== requestId.current) return;
      setData(result);
      hasLoaded.current = true;
      setError("");
    } catch (requestError) {
      if (currentId !== requestId.current) return;
      if (requestError.status === 401) onUnauthorized();
      else setError(requestError.message);
    } finally {
      if (currentId === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [load, onUnauthorized]);

  const update = useCallback((updater) => {
    setData((current) => current == null ? current : updater(current));
  }, []);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) refresh();
    });
    return () => {
      cancelled = true;
      requestId.current += 1;
    };
  }, [refresh]);

  return { data, error, loading, refreshing, refresh, update };
}
