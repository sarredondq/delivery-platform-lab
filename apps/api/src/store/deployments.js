// In-memory deployment store

const deployments = new Map();
let nextId = 1;

export function getAllDeployments() {
  return Array.from(deployments.values()).sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
}

export function getDeploymentById(id) {
  return deployments.get(id) || null;
}

export function createDeployment({ name, environment, version }) {
  const deployment = {
    id: nextId++,
    name,
    environment,
    version,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  deployments.set(deployment.id, deployment);

  // Simulate async status change
  setTimeout(() => {
    const d = deployments.get(deployment.id);
    if (d) {
      d.status = Math.random() > 0.1 ? 'success' : 'failed';
    }
  }, 2000);

  return deployment;
}

export function deleteDeployment(id) {
  const existed = deployments.has(id);
  deployments.delete(id);
  return existed;
}

export function getMetrics() {
  const all = Array.from(deployments.values());
  const total = all.length;
  const successful = all.filter(d => d.status === 'success').length;
  const failed = all.filter(d => d.status === 'failed').length;
  const pending = all.filter(d => d.status === 'pending').length;

  return {
    totalDeployments: total,
    successful,
    failed,
    pending,
    successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
    uptime: process.uptime(),
  };
}

export function clearDeployments() {
  deployments.clear();
  nextId = 1;
}
