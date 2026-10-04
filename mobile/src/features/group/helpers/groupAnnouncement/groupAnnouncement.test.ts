import { isGroupAnnouncementPending, saveGroupAnnouncementSeen } from './groupAnnouncement';

jest.mock('expo-sqlite/kv-store', () => {
  const values = new Map<string, string>();
  return {
    getItem: async (key: string) => values.get(key) ?? null,
    setItem: async (key: string, value: string) => {
      values.set(key, value);
    },
  };
});

describe('group announcement', () => {
  it('is pending for a group never marked seen', async () => {
    await expect(isGroupAnnouncementPending('group-1')).resolves.toBe(true);
  });

  it('stops being pending for that group only, once marked seen', async () => {
    await saveGroupAnnouncementSeen('group-a');

    await expect(isGroupAnnouncementPending('group-a')).resolves.toBe(false);
    await expect(isGroupAnnouncementPending('group-b')).resolves.toBe(true);
  });
});
