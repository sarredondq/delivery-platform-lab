import { useState, useEffect } from 'react';
import { getHealth } from '../services/api';

type HealthStatus = 'loading' | 'ok' | 'unavailable';

export function useHealth() {
  const [status, setStatus] = useState<HealthStatus>('loading');

  useEffect(() => {
    getHealth()
      .then(() => setStatus('ok'))
      .catch(() => setStatus('unavailable'));
  }, []);

  return status;
}
