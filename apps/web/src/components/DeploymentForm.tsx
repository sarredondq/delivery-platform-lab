import { useState } from 'react';
import type { CreateDeploymentData } from '../types';

interface DeploymentFormProps {
  onSubmit: (data: CreateDeploymentData) => Promise<void>;
}

const ENVIRONMENTS = ['development', 'staging', 'production'] as const;

export function DeploymentForm({ onSubmit }: DeploymentFormProps) {
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<CreateDeploymentData['environment']>('development');
  const [version, setVersion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !version.trim()) {
      setError('Name and version are required');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), environment, version: version.trim() });
      setName('');
      setVersion('');
      setEnvironment('development');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create deployment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="deployment-form" onSubmit={handleSubmit}>
      <h2>New Deployment</h2>

      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="form-group">
        <label htmlFor="deploy-name">Name</label>
        <input
          id="deploy-name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="my-service"
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deploy-env">Environment</label>
        <select
          id="deploy-env"
          value={environment}
          onChange={e => setEnvironment(e.target.value as CreateDeploymentData['environment'])}
          disabled={submitting}
        >
          {ENVIRONMENTS.map(env => (
            <option key={env} value={env}>{env}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="deploy-version">Version</label>
        <input
          id="deploy-version"
          type="text"
          value={version}
          onChange={e => setVersion(e.target.value)}
          placeholder="1.0.0"
          disabled={submitting}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Deploying...' : 'Deploy'}
      </button>
    </form>
  );
}
