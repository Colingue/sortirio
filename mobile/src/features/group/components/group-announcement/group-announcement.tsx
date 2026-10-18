import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GroupReady } from '@/features/group/components/group-ready/group-ready';
import {
  isGroupAnnouncementPending,
  saveGroupAnnouncementSeen,
} from '@/features/group/helpers/groupAnnouncement/groupAnnouncement';
import { type MyGroup } from '@/features/group/helpers/myGroup/myGroup';

export type GroupAnnouncementProps = {
  group: MyGroup;
  myUserId: string | undefined;
};

export function GroupAnnouncement({ group, myUserId }: GroupAnnouncementProps) {
  const [pendingGroup, setPendingGroup] = useState<MyGroup | null>(null);

  useEffect(() => {
    let cancelled = false;

    isGroupAnnouncementPending(group.groupId)
      .then((pending) => pending && !cancelled && setPendingGroup(group))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [group]);

  function closeAnnouncement() {
    if (pendingGroup) void saveGroupAnnouncementSeen(pendingGroup.groupId).catch(() => {});
    setPendingGroup(null);
  }

  function openGroup() {
    closeAnnouncement();
    router.push('/group');
  }

  if (!pendingGroup) return null;

  return (
    <Modal visible animationType="fade" onRequestClose={closeAnnouncement}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <GroupReady
          group={pendingGroup}
          myUserId={myUserId}
          onOpenGroup={openGroup}
          onClose={closeAnnouncement}
        />
      </SafeAreaProvider>
    </Modal>
  );
}
