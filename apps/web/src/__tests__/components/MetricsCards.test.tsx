import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { MetricsCards } from '../../components/MetricsCards';

describe('MetricsCards', () => {
  test('shows loading state', () => {
    render(<MetricsCards metrics={null} loading={true} error={null} />);
    expect(screen.getByText('Loading metrics...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(<MetricsCards metrics={null} loading={false} error="Something went wrong" />);
    expect(screen.getByText('Failed to load metrics')).toBeInTheDocument();
  });

  test('renders nothing when no metrics and not loading', () => {
    const { container } = render(<MetricsCards metrics={null} loading={false} error={null} />);
    expect(container.innerHTML).toBe('');
  });

  test('renders all metric cards', () => {
    const metrics = {
      totalDeployments: 10,
      successful: 7,
      failed: 2,
      pending: 1,
      successRate: 70,
      uptime: 7200,
    };
    render(<MetricsCards metrics={metrics} loading={false} error={null} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('2h 0m')).toBeInTheDocument();
  });

  test('formats uptime in minutes when less than 1 hour', () => {
    const metrics = {
      totalDeployments: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      successRate: 0,
      uptime: 300,
    };
    render(<MetricsCards metrics={metrics} loading={false} error={null} />);
    expect(screen.getByText('5m')).toBeInTheDocument();
  });
});
