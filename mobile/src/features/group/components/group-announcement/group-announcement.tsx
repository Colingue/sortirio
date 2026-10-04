import { useEffect, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import {
  isGroupAnnouncementPending,
  saveGroupAnnouncementSeen,
} from '@/features/group/helpers/groupAnnouncement/groupAnnouncement';
import { fetchMyGroup } from '@/features/group/helpers/myGroup/myGroup';

export function GroupAnnouncement() {
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    async function findPendingGroupId() {
      const group = await fetchMyGroup();
      if (group && (await isGroupAnnouncementPending(group.groupId))) setGroupId(group.groupId);
    }

    findPendingGroupId().catch(() => {});
  }, []);

  function closeAnnouncement() {
    if (groupId) void saveGroupAnnouncementSeen(groupId).catch(() => {});
    setGroupId(null);
  }

  return (
    <Modal
      visible={groupId !== null}
      transparent
      animationType="fade"
      onRequestClose={closeAnnouncement}
    >
      <View style={styles.backdrop}>
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.text}>
            Ton groupe est là
          </ThemedText>
          <PrimaryButton label="OK" onPress={closeAnnouncement} />
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    gap: Spacing.four,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  text: {
    textAlign: 'center',
  },
});
