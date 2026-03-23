import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { clearDeployments } from '../src/store/deployments.js';

beforeEach(() => {
  clearDeployments();
});

describe('validateDeployment middleware (via POST /deployments)', () => {
  it('should pass validation with valid data', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'valid-service', environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(201);
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual(
      expect.arrayContaining(['name is required and must be a non-empty string'])
    );
  });

  it('should return 400 when name is an empty string', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: '', environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining(['name is required and must be a non-empty string'])
    );
  });

  it('should return 400 when name exceeds 100 characters', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'x'.repeat(101), environment: 'production', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining(['name must be 100 characters or less'])
    );
  });

  it('should accept a name of exactly 100 characters', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'x'.repeat(100), environment: 'production', version: '1.0.0' });

    expect(res.status).toBe(201);
  });

  it('should return 400 when environment is invalid', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'svc', environment: 'uat', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'environment is required and must be one of: development, staging, production',
      ])
    );
  });

  it('should accept all valid environments', async () => {
    for (const env of ['development', 'staging', 'production']) {
      const res = await request(app)
        .post('/deployments')
        .send({ name: 'svc', environment: env, version: '1.0.0' });

      expect(res.status).toBe(201);
    }
  });

  it('should return 400 when version is missing', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'svc', environment: 'staging' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining(['version is required and must be a non-empty string'])
    );
  });

  it('should return 400 when version is an empty string', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'svc', environment: 'staging', version: '' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining(['version is required and must be a non-empty string'])
    );
  });

  it('should return multiple errors when multiple fields are invalid', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: '', environment: 'invalid', version: '' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(3);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'name is required and must be a non-empty string',
        'environment is required and must be one of: development, staging, production',
        'version is required and must be a non-empty string',
      ])
    );
  });

  it('should return all errors when body is empty', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(3);
  });
});
