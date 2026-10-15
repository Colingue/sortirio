import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { fetchMyProfile, type MyProfile } from '@/features/profile/helpers/myProfile/myProfile';

export type MyProfileState =
  { status: 'loading' } | { status: 'failed' } | { status: 'ready'; profile: MyProfile };

export function useMyProfile(userId: string | undefined): MyProfileState {
  const [myProfile, setMyProfile] = useState<MyProfileState>({ status: 'loading' });

  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      let cancelled = false;

      fetchMyProfile(userId)
        .then((profile) => !cancelled && setMyProfile({ status: 'ready', profile }))
        .catch(() => !cancelled && setMyProfile({ status: 'failed' }));

      return () => {
        cancelled = true;
      };
    }, [userId]),
  );

  return myProfile;
}
