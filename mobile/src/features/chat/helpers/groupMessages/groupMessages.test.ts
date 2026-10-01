import { supabase } from '@/lib/supabase';

import {
  addNewMessages,
  fetchGroupMessages,
  findMessageAuthor,
  formatMessageTime,
  type GroupMessage,
  type MessageAuthor,
} from './groupMessages';

jest.mock('@/lib/supabase', () => ({ supabase: { from: jest.fn() } }));

const mockFrom = supabase.from as jest.Mock;
const mockOrder = jest.fn();

function buildMessage(overrides: Partial<GroupMessage> = {}): GroupMessage {
  return {
    id: 'message-1',
    authorId: 'user-1',
    body: 'On se retrouve où ?',
    createdAt: '2026-10-02T18:00:00.000Z',
    ...overrides,
  };
}

beforeEach(() => {
  jest.clearAllMocks();
  mockFrom.mockReturnValue({
    select: () => ({ eq: () => ({ order: mockOrder }) }),
  });
  mockOrder.mockResolvedValue({ data: [], error: null });
});

describe('addNewMessages', () => {
  it('ignores a message already in the list', () => {
    const existing = [buildMessage()];

    expect(addNewMessages(existing, [buildMessage({ body: 'écho realtime' })])).toEqual(existing);
  });

  it('appends a message it has never seen', () => {
    const merged = addNewMessages(
      [buildMessage()],
      [buildMessage({ id: 'message-2', createdAt: '2026-10-02T18:01:00.000Z' })],
    );

    expect(merged.map((message) => message.id)).toEqual(['message-1', 'message-2']);
  });

  it('puts an older message back in its place', () => {
    const merged = addNewMessages(
      [buildMessage({ id: 'message-2', createdAt: '2026-10-02T18:05:00.000Z' })],
      [buildMessage({ id: 'message-1', createdAt: '2026-10-02T18:00:00.000Z' })],
    );

    expect(merged.map((message) => message.id)).toEqual(['message-1', 'message-2']);
  });

  it('orders two messages of the same second by id', () => {
    const merged = addNewMessages(
      [],
      [buildMessage({ id: 'message-b' }), buildMessage({ id: 'message-a' })],
    );

    expect(merged.map((message) => message.id)).toEqual(['message-a', 'message-b']);
  });
});

describe('formatMessageTime', () => {
  it('shows the hour and minute of the server timestamp', () => {
    expect(formatMessageTime(new Date(2026, 9, 2, 20, 5).toISOString())).toBe('20:05');
  });

  it('pads a single digit hour', () => {
    expect(formatMessageTime(new Date(2026, 9, 3, 1, 7).toISOString())).toBe('01:07');
  });
});

describe('findMessageAuthor', () => {
  const author: MessageAuthor = { firstName: 'Alix', photoUrl: 'https://signed/one' };

  it('finds the author among the group members', () => {
    expect(findMessageAuthor(new Map([['user-1', author]]), 'user-1')).toEqual(author);
  });

  it('has no author for someone the group screen does not know', () => {
    expect(findMessageAuthor(new Map([['user-1', author]]), 'user-9')).toBeUndefined();
  });
});

describe('fetchGroupMessages', () => {
  it('has no message in a group nobody wrote in', async () => {
    await expect(fetchGroupMessages('group-1')).resolves.toEqual([]);
  });

  it('turns every row into a message', async () => {
    mockOrder.mockResolvedValue({
      data: [
        {
          id: 'message-1',
          author_id: 'user-1',
          body: 'On se retrouve où ?',
          created_at: '2026-10-02T18:00:00.000Z',
        },
      ],
      error: null,
    });

    await expect(fetchGroupMessages('group-1')).resolves.toEqual([buildMessage()]);
  });

  it('throws when the messages could not be read', async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: 'boom' } });

    await expect(fetchGroupMessages('group-1')).rejects.toEqual({ message: 'boom' });
  });
});
