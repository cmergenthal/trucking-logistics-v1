// src/hooks/usePollingFetch.js
import { useEffect, useState } from "react";

export function usePollingFetch(url, intervalMs = 5000) {
  const [data, setData] = useState([]);      // ✅ default to []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    let intervalId;

    const load = () => {
      setLoading(true);
      fetch(`${url}?_=${Date.now()}`, { cache: "no-store" })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((json) => {
          if (!isCancelled) {
            // ✅ make sure we always store an array or object, never null
            setData(json ?? []);
            setError(null);
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("Polling fetch error:", err);
            setError(err);
            setData([]);        // ✅ on error, treat as empty
          }
        })
        .finally(() => {
          if (!isCancelled) setLoading(false);
        });
    };

    load(); // initial load
    intervalId = setInterval(load, intervalMs);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [url, intervalMs]);

  return { data, loading, error };
}
