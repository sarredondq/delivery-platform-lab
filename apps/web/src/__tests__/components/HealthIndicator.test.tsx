import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { HealthIndicator } from '../../components/HealthIndicator';

const mockGetHealth = vi.fn();

vi.mock('../../services/api', () => ({
  getHealth: (...args: unknown[]) => mockGetHealth(...args),
}));

describe('HealthIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows loading state initially', () => {
    mockGetHealth.mockReturnValue(new Promise(() => {})); // never resolves
    render(<HealthIndicator />);
    expect(screen.getByText('Checking...')).toBeInTheDocument();
  });

  test('shows online when health check succeeds', async () => {
    mockGetHealth.mockResolvedValue({ status: 'ok' });
    render(<HealthIndicator />);
    await waitFor(() => {
      expect(screen.getByText('API Online')).toBeInTheDocument();
    });
  });

  test('shows offline when health check fails', async () => {
    mockGetHealth.mockRejectedValue(new Error('Network error'));
    render(<HealthIndicator />);
    await waitFor(() => {
      expect(screen.getByText('API Offline')).toBeInTheDocument();
    });
  });

  test('has status role', () => {
    mockGetHealth.mockReturnValue(new Promise(() => {}));
    render(<HealthIndicator />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
