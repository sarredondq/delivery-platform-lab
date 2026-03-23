import { useState, useEffect, useCallback } from 'react';
import type { Deployment, CreateDeploymentData } from '../types';
import { getDeployments, createDeployment as apiCreateDeployment, deleteDeployment as apiDeleteDeployment } from '../services/api';

interface UseDeploymentsReturn {
  deployments: Deployment[];
  loading: boolean;
  error: string | null;
  create: (data: CreateDeploymentData) => Promise<void>;
  remove: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDeployments(): UseDeploymentsReturn {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDeployments();
      setDeployments(response.deployments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deployments');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: CreateDeploymentData) => {
    await apiCreateDeployment(data);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    await apiDeleteDeployment(id);
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { deployments, loading, error, create, remove, refresh };
}
