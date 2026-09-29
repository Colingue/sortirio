import { router } from 'expo-router';

import { ScreenStatus } from '@/components/screen-status';
import { GroupDetails } from '@/features/group/components/group-details/group-details';
import { openMapsForAddress } from '@/features/group/helpers/maps/maps';
import { useMyGroup } from '@/features/group/hooks/useMyGroup/useMyGroup';

export default function GroupScreen() {
  const myGroup = useMyGroup();

  if (myGroup.status !== 'ready' || !myGroup.group) {
    return <ScreenStatus failed={myGroup.status === 'failed'} />;
  }

  const { group } = myGroup;

  return (
    <GroupDetails
      venueName={group.venueName}
      venueAddress={group.venueAddress}
      members={group.members}
      onOpenAddress={() => void openMapsForAddress(group.venueAddress)}
      onBack={() => router.back()}
    />
  );
}
