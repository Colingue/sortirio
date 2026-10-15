import { router } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { signOut } from '@/features/auth/helpers/signOut/signOut';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { MyProfile } from '@/features/profile/components/my-profile/my-profile';
import { useMyProfile } from '@/features/profile/hooks/useMyProfile/useMyProfile';

export default function MyProfileScreen() {
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;
  const myProfile = useMyProfile(myUserId);

  if (myProfile.status !== 'ready') return <ScreenStatus failed={myProfile.status === 'failed'} />;

  return (
    <MyProfile
      profile={myProfile.profile}
      onEdit={() => router.push('/edit-profile')}
      onSignOut={() => void signOut().catch(() => {})}
    />
  );
}
