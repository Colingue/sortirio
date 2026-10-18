import { useEffect, useState } from 'react';

import { fetchMyGroup, type MyGroup } from '@/features/group/helpers/myGroup/myGroup';

export type MyGroupState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; group: MyGroup | null };

export function useMyGroup() {
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

  async function loadMyGroup() {
    const group = await fetchMyGroup().catch(() => undefined);
    if (group !== undefined) setMyGroup({ status: 'ready', group });
  }

  return { ...myGroup, loadMyGroup };
}
