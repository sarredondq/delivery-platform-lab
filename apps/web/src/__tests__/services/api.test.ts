import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getHealth, getDeployments, createDeployment, deleteDeployment, getMetrics, getInfo, getDeployment } from '../../services/api';

describe('API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('getHealth fetches /health', async () => {
    const mockResponse = { status: 'ok', timestamp: '2026-01-01T00:00:00.000Z' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getHealth();
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/health'),
      expect.objectContaining({ headers: { 'Content-Type': 'application/json' } })
    );
  });

  test('getInfo fetches /info', async () => {
    const mockResponse = { name: 'test', version: '1.0.0', environment: 'development' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getInfo();
    expect(result).toEqual(mockResponse);
  });

  test('getDeployments fetches /deployments', async () => {
    const mockResponse = { deployments: [], total: 0 };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getDeployments();
    expect(result).toEqual(mockResponse);
  });

  test('getDeployment fetches /deployments/:id', async () => {
    const mockResponse = { id: 1, name: 'test', environment: 'production', version: '1.0.0', status: 'success', createdAt: '2026-01-01' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getDeployment(1);
    expect(result).toEqual(mockResponse);
  });

  test('createDeployment posts to /deployments', async () => {
    const input = { name: 'test', environment: 'production' as const, version: '1.0.0' };
    const mockResponse = { id: 1, ...input, status: 'pending', createdAt: '2026-01-01' };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await createDeployment(input);
    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/deployments'),
      expect.objectContaining({ method: 'POST', body: JSON.stringify(input) })
    );
  });

  test('deleteDeployment sends DELETE to /deployments/:id', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.reject(new Error('No content')),
    } as Response);

    await deleteDeployment(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/deployments/1'),
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  test('getMetrics fetches /metrics', async () => {
    const mockResponse = { totalDeployments: 5, successful: 3, failed: 1, pending: 1, successRate: 60, uptime: 1000 };
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const result = await getMetrics();
    expect(result).toEqual(mockResponse);
  });

  test('throws error on non-ok response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Server error' }),
    } as Response);

    await expect(getHealth()).rejects.toThrow('Server error');
  });

  test('throws generic error when response has no error field', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.reject(new Error('parse error')),
    } as Response);

    await expect(getHealth()).rejects.toThrow('Request failed');
  });

  test('handles validation errors array', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ errors: ['name is required', 'version is required'] }),
    } as Response);

    await expect(createDeployment({ name: '', environment: 'production', version: '' })).rejects.toThrow('name is required, version is required');
  });
});
