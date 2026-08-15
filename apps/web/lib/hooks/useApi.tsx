'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}

type AsyncFn<Args extends unknown[], Result> = (...args: Args) => Promise<Result>;

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseApiOptions<Result> {
  onSuccess?: (data: Result) => void;
  onError?: (error: ApiError) => void;
  onFinally?: () => void;
  fetchOnMount?: boolean;
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  if (typeof error === 'object' && error !== null) {
    const err = error as any;

    return {
      status: err.status,
      message: err.message ?? 'Something went wrong.',
      data: err.data,
    };
  }

  return {
    message: 'Something went wrong.',
  };
}

export const useApi = <Args extends unknown[], Result>(
  apiFn: AsyncFn<Args, Result>,
  options?: UseApiOptions<Result>,
) => {
  const mounted = useRef(true);
  const requestId = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<Result | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      const currentRequest = ++requestId.current;

      setStatus('loading');
      setError(null);

      try {
        const result = await apiFn(...args);

        if (mounted.current && currentRequest === requestId.current) {
          setData(result);
          setStatus('success');
        }

        options?.onSuccess?.(result);

        return result;
      } catch (e) {
        const err = normalizeError(e);

        if (mounted.current && currentRequest === requestId.current) {
          setError(err);
          setStatus('error');
        }

        options?.onError?.(err);

        throw err;
      } finally {
        if (mounted.current && currentRequest === requestId.current) {
          options?.onFinally?.();
        }
      }
    },
    [apiFn, options],
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setData(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,

    data,
    error,

    status,
    loading: status === 'loading',
    success: status === 'success',
    idle: status === 'idle',

    reset,
    clearError,
  };
};
