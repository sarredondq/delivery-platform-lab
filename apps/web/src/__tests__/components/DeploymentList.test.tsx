import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { DeploymentList } from '../../components/DeploymentList';
import type { Deployment } from '../../types';

const mockDeployments: Deployment[] = [
  {
    id: 1,
    name: 'api-service',
    environment: 'production',
    version: '1.0.0',
    status: 'success',
    createdAt: '2026-01-15T10:30:00.000Z',
  },
  {
    id: 2,
    name: 'web-app',
    environment: 'staging',
    version: '2.0.0-beta',
    status: 'pending',
    createdAt: '2026-01-15T11:00:00.000Z',
  },
];

describe('DeploymentList', () => {
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDelete.mockResolvedValue(undefined);
  });

  test('shows loading state', () => {
    render(<DeploymentList deployments={[]} loading={true} error={null} onDelete={mockDelete} />);
    expect(screen.getByText('Loading deployments...')).toBeInTheDocument();
  });

  test('shows error state', () => {
    render(<DeploymentList deployments={[]} loading={false} error="Failed" onDelete={mockDelete} />);
    expect(screen.getByText('Failed to load deployments')).toBeInTheDocument();
  });

  test('shows empty state', () => {
    render(<DeploymentList deployments={[]} loading={false} error={null} onDelete={mockDelete} />);
    expect(screen.getByText(/no deployments yet/i)).toBeInTheDocument();
  });

  test('renders deployments table', () => {
    render(<DeploymentList deployments={mockDeployments} loading={false} error={null} onDelete={mockDelete} />);
    expect(screen.getByText('api-service')).toBeInTheDocument();
    expect(screen.getByText('web-app')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('2.0.0-beta')).toBeInTheDocument();
  });

  test('renders status badges', () => {
    render(<DeploymentList deployments={mockDeployments} loading={false} error={null} onDelete={mockDelete} />);
    expect(screen.getByText('success')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  test('renders environment badges', () => {
    render(<DeploymentList deployments={mockDeployments} loading={false} error={null} onDelete={mockDelete} />);
    expect(screen.getByText('production')).toBeInTheDocument();
    expect(screen.getByText('staging')).toBeInTheDocument();
  });

  test('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    render(<DeploymentList deployments={mockDeployments} loading={false} error={null} onDelete={mockDelete} />);

    await user.click(screen.getByLabelText('Delete api-service'));
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  test('shows deployment count in heading', () => {
    render(<DeploymentList deployments={mockDeployments} loading={false} error={null} onDelete={mockDelete} />);
    expect(screen.getByText('Deployments (2)')).toBeInTheDocument();
  });
});
