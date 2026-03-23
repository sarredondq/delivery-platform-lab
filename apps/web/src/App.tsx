import { HealthIndicator } from './components/HealthIndicator';
import { MetricsCards } from './components/MetricsCards';
import { DeploymentForm } from './components/DeploymentForm';
import { DeploymentList } from './components/DeploymentList';
import { useDeployments } from './hooks/useDeployments';
import { useMetrics } from './hooks/useMetrics';

function App() {
  const { deployments, loading, error, create, remove } = useDeployments();
  const { metrics, loading: metricsLoading, error: metricsError } = useMetrics();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Delivery Platform Lab</h1>
        <HealthIndicator />
      </header>

      <main className="app-main">
        <section className="section-metrics">
          <MetricsCards metrics={metrics} loading={metricsLoading} error={metricsError} />
        </section>

        <div className="content-grid">
          <section className="section-form">
            <DeploymentForm onSubmit={create} />
          </section>

          <section className="section-list">
            <DeploymentList
              deployments={deployments}
              loading={loading}
              error={error}
              onDelete={remove}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
