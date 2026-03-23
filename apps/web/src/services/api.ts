import type { DeploymentsResponse, Deployment, Metrics, HealthResponse, InfoResponse, CreateDeploymentData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.errors?.join(', ') || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export function getHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>('/health');
}

export function getInfo(): Promise<InfoResponse> {
  return fetchJson<InfoResponse>('/info');
}

export function getDeployments(): Promise<DeploymentsResponse> {
  return fetchJson<DeploymentsResponse>('/deployments');
}

export function getDeployment(id: number): Promise<Deployment> {
  return fetchJson<Deployment>(`/deployments/${id}`);
}

export function createDeployment(data: CreateDeploymentData): Promise<Deployment> {
  return fetchJson<Deployment>('/deployments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteDeployment(id: number): Promise<void> {
  return fetchJson<void>(`/deployments/${id}`, { method: 'DELETE' });
}

export function getMetrics(): Promise<Metrics> {
  return fetchJson<Metrics>('/metrics');
}
