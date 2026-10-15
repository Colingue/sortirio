import { router } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { useSessionState } from '@/features/auth/providers/session-provider/session-provider';
import { EditProfile } from '@/features/profile/components/edit-profile/edit-profile';
import { useMyProfile } from '@/features/profile/hooks/useMyProfile/useMyProfile';

export default function EditProfileScreen() {
  const session = useSessionState();
  const myUserId = session.status === 'ready' ? session.session?.user.id : undefined;
  const myProfile = useMyProfile(myUserId);

  function navigateToMyProfile() {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  }

  if (!myUserId || myProfile.status !== 'ready') {
    return <ScreenStatus failed={myProfile.status === 'failed'} />;
  }

  return (
    <EditProfile
      userId={myUserId}
      profile={myProfile.profile}
      onSaved={navigateToMyProfile}
      onBack={navigateToMyProfile}
    />
  );
}
