// Deployment routes — CRUD operations

import { Router } from 'express';
import {
  getAllDeployments,
  getDeploymentById,
  createDeployment,
  deleteDeployment,
} from '../store/deployments.js';
import { validateDeployment } from '../middleware/validate.js';

const router = Router();

// GET /deployments — List all deployments
router.get('/', (req, res) => {
  const deployments = getAllDeployments();
  res.json({ deployments, total: deployments.length });
});

// GET /deployments/:id — Get a single deployment
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid deployment ID' });
  }

  const deployment = getDeploymentById(id);

  if (!deployment) {
    return res.status(404).json({ error: 'Deployment not found' });
  }

  res.json(deployment);
});

// POST /deployments — Create a new deployment
router.post('/', validateDeployment, (req, res) => {
  const { name, environment, version } = req.body;
  const deployment = createDeployment({ name, environment, version });
  res.status(201).json(deployment);
});

// DELETE /deployments/:id — Delete a deployment
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid deployment ID' });
  }

  const deleted = deleteDeployment(id);

  if (!deleted) {
    return res.status(404).json({ error: 'Deployment not found' });
  }

  res.status(204).send();
});

export default router;
