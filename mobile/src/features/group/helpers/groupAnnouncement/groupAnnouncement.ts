import Storage from 'expo-sqlite/kv-store';

function getSeenKey(groupId: string): string {
  return `group-announcement-seen:${groupId}`;
}

export async function isGroupAnnouncementPending(groupId: string): Promise<boolean> {
  return (await Storage.getItem(getSeenKey(groupId))) === null;
}

export async function saveGroupAnnouncementSeen(groupId: string): Promise<void> {
  await Storage.setItem(getSeenKey(groupId), '1');
}
