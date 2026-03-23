import type { Deployment } from '../types';

interface DeploymentListProps {
  deployments: Deployment[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => Promise<void>;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString();
}

function StatusBadge({ status }: { status: Deployment['status'] }) {
  return (
    <span className={`status-badge status-${status}`}>
      {status}
    </span>
  );
}

function EnvironmentBadge({ environment }: { environment: Deployment['environment'] }) {
  return (
    <span className={`env-badge env-${environment}`}>
      {environment}
    </span>
  );
}

export function DeploymentList({ deployments, loading, error, onDelete }: DeploymentListProps) {
  if (loading) {
    return <div className="deployment-list" aria-label="Loading deployments">Loading deployments...</div>;
  }

  if (error) {
    return <div className="deployment-list deployment-error" role="alert">Failed to load deployments</div>;
  }

  if (deployments.length === 0) {
    return (
      <div className="deployment-list deployment-empty">
        <p>No deployments yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <div className="deployment-list">
      <h2>Deployments ({deployments.length})</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Environment</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map(deployment => (
            <tr key={deployment.id}>
              <td>{deployment.name}</td>
              <td><code>{deployment.version}</code></td>
              <td><EnvironmentBadge environment={deployment.environment} /></td>
              <td><StatusBadge status={deployment.status} /></td>
              <td>{formatDate(deployment.createdAt)}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(deployment.id)}
                  aria-label={`Delete ${deployment.name}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
