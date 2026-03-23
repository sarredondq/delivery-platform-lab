import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from '../App';

// Mock all API calls
vi.mock('../services/api', () => ({
  getHealth: vi.fn().mockResolvedValue({ status: 'ok', timestamp: new Date().toISOString() }),
  getDeployments: vi.fn().mockResolvedValue({ deployments: [], total: 0 }),
  getMetrics: vi.fn().mockResolvedValue({
    totalDeployments: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    successRate: 0,
    uptime: 3600,
  }),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the heading', () => {
    render(<App />);
    expect(screen.getByText('Delivery Platform Lab')).toBeInTheDocument();
  });

  test('renders the health indicator', () => {
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders the deployment form', () => {
    render(<App />);
    expect(screen.getByText('New Deployment')).toBeInTheDocument();
  });

  test('renders the deploy button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /deploy/i })).toBeInTheDocument();
  });
});
