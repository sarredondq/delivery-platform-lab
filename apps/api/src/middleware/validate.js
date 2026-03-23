// Request validation middleware

const VALID_ENVIRONMENTS = ['development', 'staging', 'production'];

export function validateDeployment(req, res, next) {
  const { name, environment, version } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('name is required and must be a non-empty string');
  } else if (name.trim().length > 100) {
    errors.push('name must be 100 characters or less');
  }

  if (!environment || !VALID_ENVIRONMENTS.includes(environment)) {
    errors.push(`environment is required and must be one of: ${VALID_ENVIRONMENTS.join(', ')}`);
  }

  if (!version || typeof version !== 'string' || version.trim().length === 0) {
    errors.push('version is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.name = name.trim();
  req.body.version = version.trim();
  next();
}
