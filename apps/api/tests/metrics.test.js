import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { clearDeployments, createDeployment } from '../src/store/deployments.js';

beforeEach(() => {
  clearDeployments();
});

describe('GET /metrics', () => {
  it('should return zero metrics when no deployments exist', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      totalDeployments: 0,
      successful: 0,
      failed: 0,
      pending: 0,
      successRate: 0,
    });
  });

  it('should include uptime as a number', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('should return successRate of 0 when no deployments exist', async () => {
    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.body.successRate).toBe(0);
  });

  it('should return correct counts after creating deployments', async () => {
    // Create one deployment (starts as pending)
    createDeployment({ name: 'svc-a', environment: 'staging', version: '1.0.0' });

    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.body.totalDeployments).toBe(1);
    expect(res.body.pending).toBe(1);
    expect(res.body.successful).toBe(0);
    expect(res.body.failed).toBe(0);
    expect(res.body.successRate).toBe(0);
  });

  it('should calculate successRate correctly when there are successful deployments', async () => {
    // Manually create deployments with controlled statuses
    const d1 = createDeployment({ name: 'svc-a', environment: 'staging', version: '1.0.0' });
    const d2 = createDeployment({ name: 'svc-b', environment: 'staging', version: '1.0.1' });

    // Manually mutate status to simulate completed deployments
    d1.status = 'success';
    d2.status = 'failed';

    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.body.totalDeployments).toBe(2);
    expect(res.body.successful).toBe(1);
    expect(res.body.failed).toBe(1);
    expect(res.body.pending).toBe(0);
    expect(res.body.successRate).toBe(50);
  });

  it('should reflect all deployments in total count', async () => {
    createDeployment({ name: 'svc-a', environment: 'development', version: '1.0.0' });
    createDeployment({ name: 'svc-b', environment: 'staging', version: '1.0.0' });
    createDeployment({ name: 'svc-c', environment: 'production', version: '1.0.0' });

    const res = await request(app).get('/metrics');

    expect(res.status).toBe(200);
    expect(res.body.totalDeployments).toBe(3);
  });
});
