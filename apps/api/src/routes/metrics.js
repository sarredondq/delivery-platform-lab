// Metrics route — deployment statistics

import { Router } from 'express';
import { getMetrics } from '../store/deployments.js';

const router = Router();

// GET /metrics — Get deployment metrics
router.get('/', (req, res) => {
  const metrics = getMetrics();
  res.json(metrics);
});

export default router;
