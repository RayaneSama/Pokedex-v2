import { useState, useEffect, useRef } from "react";

function useQuery(initialURL) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dataCache = useRef(new Map());

  useEffect(() => {
    setLoading(true);
    fetch(initialURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((json) => {
        dataCache.current.set(initialURL, json);
        setData(json);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [initialURL]);

  function fetcher(urlToFetch) {
    setLoading(true);
    const cache = dataCache.current;
    if (cache.has(urlToFetch)) {
      setData(cache.get(urlToFetch));
      setError(null);
      console.log("CACHE HIT: ", urlToFetch);
      setLoading(false);
      return;
    }

    fetch(urlToFetch)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokémon not found");
        }
        return response.json();
      })
      .then((json) => {
        cache.set(urlToFetch, json);
        setData(json);
        setError(null);
        console.log("CACHE MISS: ", urlToFetch);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return { data, fetcher, error, loading };
}

export default useQuery;
