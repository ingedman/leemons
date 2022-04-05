import { useMemo } from 'react';
import { getCentersWithToken } from '@users/session';
import { useApi } from '@common';

// EN: Gets the user agents of the current user
// ES: Obtiene los user agents del usuario actual
export default function useUserAgents() {
  const [centers] = useApi(getCentersWithToken);

  return useMemo(() => {
    if (!centers?.length) {
      return [];
    }
    return centers.map((agent) => agent.userAgentId);
  }, [centers]);
}
