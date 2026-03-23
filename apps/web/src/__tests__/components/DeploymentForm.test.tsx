import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { DeploymentForm } from '../../components/DeploymentForm';

describe('DeploymentForm', () => {
  const mockSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockSubmit.mockResolvedValue(undefined);
  });

  test('renders form fields', () => {
    render(<DeploymentForm onSubmit={mockSubmit} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Environment')).toBeInTheDocument();
    expect(screen.getByLabelText('Version')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<DeploymentForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'my-service');
    await user.type(screen.getByLabelText('Version'), '1.0.0');
    await user.click(screen.getByRole('button', { name: /deploy/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'my-service',
      environment: 'development',
      version: '1.0.0',
    });
  });

  test('shows error when name is empty', async () => {
    const user = userEvent.setup();
    render(<DeploymentForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Version'), '1.0.0');
    await user.click(screen.getByRole('button', { name: /deploy/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Name and version are required');
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('shows error when version is empty', async () => {
    const user = userEvent.setup();
    render(<DeploymentForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'my-service');
    await user.click(screen.getByRole('button', { name: /deploy/i }));

    expect(screen.getByRole('alert')).toHaveTextContent('Name and version are required');
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('shows error when submission fails', async () => {
    mockSubmit.mockRejectedValue(new Error('Server error'));
    const user = userEvent.setup();
    render(<DeploymentForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'my-service');
    await user.type(screen.getByLabelText('Version'), '1.0.0');
    await user.click(screen.getByRole('button', { name: /deploy/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Server error');
  });

  test('clears form after successful submission', async () => {
    const user = userEvent.setup();
    render(<DeploymentForm onSubmit={mockSubmit} />);

    await user.type(screen.getByLabelText('Name'), 'my-service');
    await user.type(screen.getByLabelText('Version'), '1.0.0');
    await user.click(screen.getByRole('button', { name: /deploy/i }));

    await vi.waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveValue('');
      expect(screen.getByLabelText('Version')).toHaveValue('');
    });
  });

  test('allows selecting environment', async () => {
    const user = userEvent.setup();
    render(<DeploymentForm onSubmit={mockSubmit} />);

    await user.selectOptions(screen.getByLabelText('Environment'), 'production');
    await user.type(screen.getByLabelText('Name'), 'my-service');
    await user.type(screen.getByLabelText('Version'), '2.0.0');
    await user.click(screen.getByRole('button', { name: /deploy/i }));

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'my-service',
      environment: 'production',
      version: '2.0.0',
    });
  });
});
