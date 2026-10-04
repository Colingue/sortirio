import { useEffect, useState } from 'react';

import { fetchGroupDetails } from '@/features/group/helpers/myGroup/myGroup';
import { type MyGroupState } from '@/features/group/hooks/useMyGroup/useMyGroup';

export function useGroupDetails(groupId: string): MyGroupState {
  const [groupDetails, setGroupDetails] = useState<MyGroupState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchGroupDetails(groupId)
      .then((group) => !cancelled && setGroupDetails({ status: 'ready', group }))
      .catch(() => !cancelled && setGroupDetails({ status: 'failed' }));

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return groupDetails;
}
