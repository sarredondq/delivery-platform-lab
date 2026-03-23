import { useState, useEffect } from 'react';
import type { Metrics } from '../types';
import { getMetrics } from '../services/api';

interface UseMetricsReturn {
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
}

export function useMetrics(): UseMetricsReturn {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMetrics()
      .then(data => {
        setMetrics(data);
        setError(null);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      })
      .finally(() => setLoading(false));
  }, []);

  return { metrics, loading, error };
}
