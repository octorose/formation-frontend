import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/api";

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const useFetch = <T>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const fetchedData = await fetchWithAuth(url);
        setData(fetchedData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);


  return { data, error, loading };
};


export default useFetch;
