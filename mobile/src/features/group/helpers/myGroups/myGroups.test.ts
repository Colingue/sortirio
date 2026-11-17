import { type FridayState } from '@/features/availability/helpers/availability/availability';

import {
  buildMyGroupsItem,
  formatLastMessageTime,
  getMyGroupsSections,
  type MyGroupsItem,
  type MyGroupsRow,
} from './myGroups';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

const NOW = new Date('2026-10-16T21:00:00');

function buildRow(overrides: Partial<MyGroupsRow> = {}): MyGroupsRow {
  return {
    group_id: 'group-1',
    friday: '2026-10-02',
    venue_name: 'Odessa',
    member_first_names: ['Alix', 'Bo', 'Chloé'],
    member_photo_paths: ['alix.jpg', 'bo.jpg', 'chloe.jpg'],
    last_message_body: null,
    last_message_at: null,
    last_message_author_id: null,
    last_message_author_first_name: null,
    ...overrides,
  };
}

describe('buildMyGroupsItem', () => {
  it('labels the friday and pairs each first name with its signed photo', () => {
    const photoUrls = new Map([
      ['alix.jpg', 'https://signed/alix'],
      ['chloe.jpg', 'https://signed/chloe'],
    ]);

    expect(buildMyGroupsItem(buildRow(), 'user-1', NOW, photoUrls)).toEqual({
      groupId: 'group-1',
      friday: '2026-10-02',
      fridayLabel: 'Vendredi 2 octobre',
      venueName: 'Odessa',
      memberFaces: [
        { firstName: 'Alix', photoUrl: 'https://signed/alix' },
        { firstName: 'Bo', photoUrl: null },
        { firstName: 'Chloé', photoUrl: 'https://signed/chloe' },
      ],
      lastMessage: null,
    });
  });

  it('names the author of the last message', () => {
    const row = buildRow({
      last_message_body: 'Je suis au fond',
      last_message_at: '2026-10-16T20:04:00',
      last_message_author_id: 'user-2',
      last_message_author_first_name: 'Inès',
    });

    expect(buildMyGroupsItem(row, 'user-1', NOW, new Map()).lastMessage).toEqual({
      preview: 'Inès : Je suis au fond',
      timeLabel: '20:04',
    });
  });

  it('says Utilisateur supprimé when the author of the last message is gone', () => {
    const row = buildRow({
      last_message_body: 'À tout à l’heure',
      last_message_at: '2026-10-16T20:04:00',
      last_message_author_id: null,
      last_message_author_first_name: null,
    });

    expect(buildMyGroupsItem(row, undefined, NOW, new Map()).lastMessage?.preview).toBe(
      'Utilisateur supprimé : À tout à l’heure',
    );
  });

  it('says Toi when I wrote the last message', () => {
    const row = buildRow({
      last_message_body: 'On remet ça ?',
      last_message_at: '2026-10-16T20:04:00',
      last_message_author_id: 'user-1',
      last_message_author_first_name: 'Alix',
    });

    expect(buildMyGroupsItem(row, 'user-1', NOW, new Map()).lastMessage?.preview).toBe(
      'Toi : On remet ça ?',
    );
  });
});

describe('formatLastMessageTime', () => {
  it('gives the hour today, the weekday this week, the date before', () => {
    expect(formatLastMessageTime('2026-10-16T08:30:00', NOW)).toBe('08:30');
    expect(formatLastMessageTime('2026-10-13T12:00:00', NOW)).toBe('mar.');
    expect(formatLastMessageTime('2026-09-27T12:00:00', NOW)).toBe('27 sept.');
  });
});

const NEXT_FRIDAY = '2026-11-20';
const BEFORE_FORMATION = new Date('2026-11-17T12:00:00');
const AFTER_FORMATION = new Date('2026-11-19T20:00:00');

function buildFridayState(overrides: Partial<FridayState> = {}): FridayState {
  return {
    nextOpenFriday: NEXT_FRIDAY,
    postedFriday: NEXT_FRIDAY,
    groupFormationAt: '2026-11-19T19:00:00',
    citySignupCount: 12,
    signupFriday: NEXT_FRIDAY,
    signupClosesAt: '2026-11-20T18:00:00',
    postedLate: false,
    ...overrides,
  };
}

function buildItem(groupId: string, friday: string): MyGroupsItem {
  return buildMyGroupsItem(buildRow({ group_id: groupId, friday }), 'user-1', NOW, new Map());
}

describe('getMyGroupsSections', () => {
  const pastGroup = buildItem('past', '2026-11-13');

  it('shows the pending card before thursday 19 h', () => {
    expect(getMyGroupsSections([], buildFridayState(), BEFORE_FORMATION)).toEqual({
      upcoming: { kind: 'pending', friday: NEXT_FRIDAY, isFormedThursday: true },
      past: [],
    });
  });

  it('keeps past groups below the pending card', () => {
    const sections = getMyGroupsSections([pastGroup], buildFridayState(), BEFORE_FORMATION);

    expect(sections.upcoming?.kind).toBe('pending');
    expect(sections.past).toEqual([pastGroup]);
  });

  it('switches the pending text after thursday 19 h', () => {
    expect(getMyGroupsSections([], buildFridayState(), AFTER_FORMATION).upcoming).toEqual({
      kind: 'pending',
      friday: NEXT_FRIDAY,
      isFormedThursday: false,
    });
  });

  it('switches the pending text when there is no formation time', () => {
    const fridayState = buildFridayState({ groupFormationAt: null });

    expect(getMyGroupsSections([], fridayState, BEFORE_FORMATION).upcoming).toMatchObject({
      isFormedThursday: false,
    });
  });

  it('replaces the pending card with the formed group', () => {
    const formed = buildItem('formed', NEXT_FRIDAY);

    expect(getMyGroupsSections([formed, pastGroup], buildFridayState(), AFTER_FORMATION)).toEqual({
      upcoming: { kind: 'group', group: formed },
      past: [pastGroup],
    });
  });

  it('moves the group to past on saturday at midnight', () => {
    const formed = buildItem('formed', NEXT_FRIDAY);
    const fridayNight = new Date('2026-11-20T23:59:00');
    const saturday = new Date('2026-11-21T00:00:00');

    expect(getMyGroupsSections([formed], buildFridayState(), fridayNight).upcoming).toEqual({
      kind: 'group',
      group: formed,
    });
    expect(getMyGroupsSections([formed], buildFridayState(), saturday)).toEqual({
      upcoming: null,
      past: [formed],
    });
  });

  it('drops the pending card once the friday is over without a group', () => {
    const saturday = new Date('2026-11-21T00:00:00');

    expect(getMyGroupsSections([], buildFridayState(), saturday).upcoming).toBeNull();
  });

  it('shows nothing upcoming when not signed up', () => {
    const fridayState = buildFridayState({ postedFriday: null });

    expect(getMyGroupsSections([], fridayState, BEFORE_FORMATION).upcoming).toBeNull();
  });

  it('shows nothing upcoming when the friday state failed to load', () => {
    expect(getMyGroupsSections([pastGroup], null, BEFORE_FORMATION)).toEqual({
      upcoming: null,
      past: [pastGroup],
    });
  });
});
