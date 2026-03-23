import type { Metrics } from '../types';

interface MetricsCardsProps {
  metrics: Metrics | null;
  loading: boolean;
  error: string | null;
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function MetricsCards({ metrics, loading, error }: MetricsCardsProps) {
  if (loading) {
    return <div className="metrics-cards" aria-label="Loading metrics">Loading metrics...</div>;
  }

  if (error) {
    return <div className="metrics-cards metrics-error" role="alert">Failed to load metrics</div>;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="metrics-cards">
      <div className="metric-card">
        <span className="metric-value">{metrics.totalDeployments}</span>
        <span className="metric-label">Total Deployments</span>
      </div>
      <div className="metric-card metric-success">
        <span className="metric-value">{metrics.successful}</span>
        <span className="metric-label">Successful</span>
      </div>
      <div className="metric-card metric-failed">
        <span className="metric-value">{metrics.failed}</span>
        <span className="metric-label">Failed</span>
      </div>
      <div className="metric-card metric-pending">
        <span className="metric-value">{metrics.pending}</span>
        <span className="metric-label">Pending</span>
      </div>
      <div className="metric-card">
        <span className="metric-value">{metrics.successRate}%</span>
        <span className="metric-label">Success Rate</span>
      </div>
      <div className="metric-card">
        <span className="metric-value">{formatUptime(metrics.uptime)}</span>
        <span className="metric-label">Uptime</span>
      </div>
    </div>
  );
}
