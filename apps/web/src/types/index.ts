export interface Deployment {
  id: number;
  name: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: string;
}

export interface DeploymentsResponse {
  deployments: Deployment[];
  total: number;
}

export interface Metrics {
  totalDeployments: number;
  successful: number;
  failed: number;
  pending: number;
  successRate: number;
  uptime: number;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface InfoResponse {
  name: string;
  version: string;
  environment: string;
}

export interface CreateDeploymentData {
  name: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
}
