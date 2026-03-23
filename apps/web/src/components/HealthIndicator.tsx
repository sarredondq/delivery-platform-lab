import { useHealth } from '../hooks/useHealth';

export function HealthIndicator() {
  const status = useHealth();

  const statusConfig = {
    loading: { label: 'Checking...', className: 'status-loading' },
    ok: { label: 'API Online', className: 'status-ok' },
    unavailable: { label: 'API Offline', className: 'status-error' },
  };

  const config = statusConfig[status];

  return (
    <div className={`health-indicator ${config.className}`} role="status">
      <span className="health-dot" />
      <span>{config.label}</span>
    </div>
  );
}
