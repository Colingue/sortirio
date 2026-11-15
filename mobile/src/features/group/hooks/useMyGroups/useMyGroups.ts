import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchFridayState } from '@/features/availability/helpers/availability/availability';
import {
  fetchMyGroups,
  getMyGroupsSections,
  type MyGroupsSections,
} from '@/features/group/helpers/myGroups/myGroups';

export type MyGroupsState =
  { status: 'loading' } | { status: 'failed' } | ({ status: 'ready' } & MyGroupsSections);

export function useMyGroups(myUserId: string | undefined): MyGroupsState {
  const [myGroups, setMyGroups] = useState<MyGroupsState>({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      Promise.all([fetchMyGroups(myUserId), fetchFridayState().catch(() => null)])
        .then(
          ([groups, fridayState]) =>
            !cancelled &&
            setMyGroups({
              status: 'ready',
              ...getMyGroupsSections(groups, fridayState, new Date()),
            }),
        )
        .catch(
          () =>
            !cancelled &&
            setMyGroups((current) => (current.status === 'ready' ? current : { status: 'failed' })),
        );

      return () => {
        cancelled = true;
      };
    }, [myUserId]),
  );

  return myGroups;
}
