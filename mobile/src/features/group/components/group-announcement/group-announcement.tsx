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
import { fetchMyGroup, type MyGroup } from '@/features/group/helpers/myGroup/myGroup';

export function GroupAnnouncement({ myUserId }: { myUserId: string | undefined }) {
  const [pendingGroup, setPendingGroup] = useState<MyGroup | null>(null);

  useEffect(() => {
    async function findPendingGroup() {
      const group = await fetchMyGroup();
      if (group && (await isGroupAnnouncementPending(group.groupId))) setPendingGroup(group);
    }

    findPendingGroup().catch(() => {});
  }, []);

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
