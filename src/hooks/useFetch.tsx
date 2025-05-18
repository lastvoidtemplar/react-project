import React from "react";

type useFetchProp = {
  endpoint: string;
  method: string;
};

type useFetchResult<T, E> = {
  loading: boolean;
  data: T | null | undefined;
  error: E | null | undefined;
  failed: boolean;
  refetch: () => void;
};

function useFetch<T, E>({
  endpoint,
  method,
}: useFetchProp): useFetchResult<T, E> {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [data, setData] = React.useState<T | null | undefined>(undefined);
  const [error, setError] = React.useState<E | null | undefined>(undefined);
  const [failed, setFailed] = React.useState<boolean>(false);
  const [reupdates, setReupdates] = React.useState<number>(0);

  const refetch = React.useCallback(() => {
    setReupdates((old) => old + 1);
  }, []);

  React.useEffect(() => {
    let isMounted = true;
    let status = -1;
    const controller = new AbortController();
    let retries = 0;

    const call = () => {
      fetch(endpoint, {
        method: method,
        signal: controller.signal,
      })
        .then((resp) => {
          if (!isMounted) {
            return;
          }

          status = resp.status;
          return resp.json();
        })
        .then((data) => {
          if (!isMounted) {
            return;
          }

          setLoading(false);
          if (200 <= status && status <= 299) {
            setData(data);
            return;
          }

          setError(data);
        })
        .catch((err) => {
          if (!isMounted) {
            return;
          }

          if (
            (err instanceof TypeError || err instanceof DOMException) &&
            retries < 3
          ) {
            retries++;
            setTimeout(() => {
              call();
            }, Math.pow(2, retries) * 1000);
            return;
          }

          setLoading(false);

          if (err instanceof SyntaxError) {
            if (200 <= status && status <= 299) {
              setData(null);
              return;
            }

            setError(null);
            return;
          }

          console.log(err, retries);
          setFailed(true);
        });
    };

    call();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [endpoint, method, reupdates]);

  return { loading, data, error, failed, refetch };
}

export default useFetch;