import { useEffect, useState } from 'react';

import { fetchMyGroup, type MyGroup } from '@/features/group/helpers/myGroup/myGroup';

export type MyGroupState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; group: MyGroup | null };

export function useMyGroup(): MyGroupState {
  const [myGroup, setMyGroup] = useState<MyGroupState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    fetchMyGroup()
      .then((group) => !cancelled && setMyGroup({ status: 'ready', group }))
      .catch(() => !cancelled && setMyGroup({ status: 'failed' }));

    return () => {
      cancelled = true;
    };
  }, []);

  return myGroup;
}
