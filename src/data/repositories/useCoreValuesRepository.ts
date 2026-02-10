import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { CoreValue } from 'domain/models';
import { apiClient } from 'data/api/axios';
import { useCoreValuesStore } from 'data/store';

const CORE_VALUES_QUERY_KEY = ['core-values'] as const;

async function fetchCoreValuesList(): Promise<CoreValue[]> {
  const { data } = await apiClient.get<CoreValue[]>('/api/v1/core-values');
  return data ?? [];
}

export const useCoreValuesRepository = () => {
  const { coreValues, loading, error, setCoreValues, setLoading, setError } =
    useCoreValuesStore();

  const { refetch } = useQuery({
    queryKey: CORE_VALUES_QUERY_KEY,
    queryFn: fetchCoreValuesList,
    enabled: false
  });

  const ensureCoreValuesLoaded = useCallback(async () => {
    if (coreValues.length > 0) {
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const { data } = await refetch();
      const list = data ?? [];
      setCoreValues(list);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load core values';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [coreValues.length, refetch, setCoreValues, setLoading, setError]);

  return {
    coreValues,
    loading,
    error,
    ensureCoreValuesLoaded
  };
}
