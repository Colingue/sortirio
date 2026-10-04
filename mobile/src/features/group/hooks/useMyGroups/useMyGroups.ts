import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchMyGroups, type MyGroupsItem } from '@/features/group/helpers/myGroups/myGroups';

export type MyGroupsState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; groups: MyGroupsItem[] };

export function useMyGroups(): MyGroupsState {
  const [myGroups, setMyGroups] = useState<MyGroupsState>({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      fetchMyGroups()
        .then((groups) => !cancelled && setMyGroups({ status: 'ready', groups }))
        .catch(
          () =>
            !cancelled &&
            setMyGroups((current) => (current.status === 'ready' ? current : { status: 'failed' })),
        );

      return () => {
        cancelled = true;
      };
    }, []),
  );

  return myGroups;
}
