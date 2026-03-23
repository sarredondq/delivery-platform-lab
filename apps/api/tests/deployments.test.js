import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { clearDeployments } from '../src/store/deployments.js';

beforeEach(() => {
  clearDeployments();
});

describe('GET /deployments', () => {
  it('should return an empty array initially', async () => {
    const res = await request(app).get('/deployments');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deployments');
    expect(res.body.deployments).toEqual([]);
    expect(res.body.total).toBe(0);
  });

  it('should return the list of deployments after creating one', async () => {
    await request(app)
      .post('/deployments')
      .send({ name: 'api-service', environment: 'staging', version: '1.0.0' });

    const res = await request(app).get('/deployments');

    expect(res.status).toBe(200);
    expect(res.body.deployments).toHaveLength(1);
    expect(res.body.total).toBe(1);
    expect(res.body.deployments[0]).toHaveProperty('name', 'api-service');
  });

  it('should return deployments sorted by createdAt descending', async () => {
    await request(app)
      .post('/deployments')
      .send({ name: 'first', environment: 'development', version: '1.0.0' });
    await request(app)
      .post('/deployments')
      .send({ name: 'second', environment: 'staging', version: '2.0.0' });

    const res = await request(app).get('/deployments');

    expect(res.status).toBe(200);
    expect(res.body.deployments[0].name).toBe('second');
    expect(res.body.deployments[1].name).toBe('first');
  });
});

describe('POST /deployments', () => {
  it('should create a deployment with valid data', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'my-service', environment: 'production', version: '2.3.1' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      id: expect.any(Number),
      name: 'my-service',
      environment: 'production',
      version: '2.3.1',
      status: 'pending',
      createdAt: expect.any(String),
    });
  });

  it('should trim name and version whitespace', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: '  my-service  ', environment: 'staging', version: '  1.0.0  ' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('my-service');
    expect(res.body.version).toBe('1.0.0');
  });

  it('should return 400 when name is missing', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'name is required and must be a non-empty string',
      ])
    );
  });

  it('should return 400 when name is an empty string', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: '', environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'name is required and must be a non-empty string',
      ])
    );
  });

  it('should return 400 when name is only whitespace', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: '   ', environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'name is required and must be a non-empty string',
      ])
    );
  });

  it('should return 400 when name exceeds 100 characters', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'a'.repeat(101), environment: 'staging', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'name must be 100 characters or less',
      ])
    );
  });

  it('should return 400 when environment is missing', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'my-service', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'environment is required and must be one of: development, staging, production',
      ])
    );
  });

  it('should return 400 when environment is invalid', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'my-service', environment: 'testing', version: '1.0.0' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'environment is required and must be one of: development, staging, production',
      ])
    );
  });

  it('should return 400 when version is missing', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'my-service', environment: 'staging' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'version is required and must be a non-empty string',
      ])
    );
  });

  it('should return 400 when version is an empty string', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({ name: 'my-service', environment: 'staging', version: '' });

    expect(res.status).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        'version is required and must be a non-empty string',
      ])
    );
  });

  it('should return multiple errors when multiple fields are invalid', async () => {
    const res = await request(app)
      .post('/deployments')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveLength(3);
  });
});

describe('GET /deployments/:id', () => {
  it('should return a deployment by id', async () => {
    const created = await request(app)
      .post('/deployments')
      .send({ name: 'api-service', environment: 'production', version: '1.0.0' });

    const res = await request(app).get(`/deployments/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: created.body.id,
      name: 'api-service',
    });
  });

  it('should return 404 for a non-existent deployment', async () => {
    const res = await request(app).get('/deployments/9999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Deployment not found' });
  });

  it('should return 400 for a non-numeric id', async () => {
    const res = await request(app).get('/deployments/abc');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid deployment ID' });
  });
});

describe('DELETE /deployments/:id', () => {
  it('should delete an existing deployment and return 204', async () => {
    const created = await request(app)
      .post('/deployments')
      .send({ name: 'temp-service', environment: 'development', version: '0.1.0' });

    const res = await request(app).delete(`/deployments/${created.body.id}`);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it('should remove the deployment from the store', async () => {
    const created = await request(app)
      .post('/deployments')
      .send({ name: 'temp-service', environment: 'development', version: '0.1.0' });

    await request(app).delete(`/deployments/${created.body.id}`);

    const res = await request(app).get(`/deployments/${created.body.id}`);
    expect(res.status).toBe(404);
  });

  it('should return 404 for a non-existent deployment', async () => {
    const res = await request(app).delete('/deployments/9999');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Deployment not found' });
  });

  it('should return 400 for a non-numeric id', async () => {
    const res = await request(app).delete('/deployments/abc');

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid deployment ID' });
  });
});
