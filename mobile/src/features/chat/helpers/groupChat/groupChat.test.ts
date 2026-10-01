import { type GroupMessage } from '@/features/chat/helpers/groupMessages/groupMessages';

import {
  addPendingMessage,
  addReceivedMessage,
  buildLoadedChat,
  confirmPendingMessage,
  findPendingMessage,
  setPendingMessageFailed,
  type GroupChatState,
} from './groupChat';

jest.mock('@/lib/supabase', () => ({ supabase: {} }));

function buildMessage(overrides: Partial<GroupMessage> = {}): GroupMessage {
  return {
    id: 'message-1',
    authorId: 'user-1',
    body: 'On se retrouve où ?',
    createdAt: '2026-10-02T18:00:00.000Z',
    ...overrides,
  };
}

function buildReadyChat(overrides: Partial<Extract<GroupChatState, { status: 'ready' }>> = {}) {
  return { status: 'ready' as const, messages: [], pending: [], ...overrides };
}

describe('buildLoadedChat', () => {
  it('turns a loading chat into the history it just read', () => {
    expect(buildLoadedChat({ status: 'loading' }, [buildMessage()])).toEqual(
      buildReadyChat({ messages: [buildMessage()] }),
    );
  });

  it('keeps what realtime delivered while the history was loading', () => {
    const received = buildMessage({ id: 'message-2', createdAt: '2026-10-02T18:01:00.000Z' });
    const current = buildReadyChat({ messages: [received] });

    expect(buildLoadedChat(current, [buildMessage()])).toEqual(
      buildReadyChat({ messages: [buildMessage(), received] }),
    );
  });
});

describe('addReceivedMessage', () => {
  it('adds a message posted by someone else', () => {
    const received = buildMessage({ id: 'message-2', createdAt: '2026-10-02T18:01:00.000Z' });

    expect(addReceivedMessage(buildReadyChat({ messages: [buildMessage()] }), received)).toEqual(
      buildReadyChat({ messages: [buildMessage(), received] }),
    );
  });

  it('ignores the echo of a message already shown', () => {
    const current = buildReadyChat({ messages: [buildMessage()] });

    expect(addReceivedMessage(current, buildMessage())).toEqual(current);
  });

  it('drops a message that arrives before the history', () => {
    expect(addReceivedMessage({ status: 'loading' }, buildMessage())).toEqual({
      status: 'loading',
    });
  });
});

describe('addPendingMessage', () => {
  it('shows my message before the server has seen it', () => {
    expect(addPendingMessage(buildReadyChat(), 1, 'Je suis en route')).toEqual(
      buildReadyChat({ pending: [{ localId: 1, body: 'Je suis en route', failed: false }] }),
    );
  });

  it('keeps the waiting messages in the order they were written', () => {
    const one = addPendingMessage(buildReadyChat(), 1, 'un');

    expect(addPendingMessage(one, 2, 'deux')).toEqual(
      buildReadyChat({
        pending: [
          { localId: 1, body: 'un', failed: false },
          { localId: 2, body: 'deux', failed: false },
        ],
      }),
    );
  });
});

describe('confirmPendingMessage', () => {
  it('replaces the waiting message by the server row', () => {
    const waiting = addPendingMessage(buildReadyChat(), 1, 'On se retrouve où ?');

    expect(confirmPendingMessage(waiting, 1, buildMessage())).toEqual(
      buildReadyChat({ messages: [buildMessage()] }),
    );
  });

  it('shows the message once when realtime echoed it first', () => {
    const waiting = addPendingMessage(
      buildReadyChat({ messages: [buildMessage()] }),
      1,
      'On se retrouve où ?',
    );

    expect(confirmPendingMessage(waiting, 1, buildMessage())).toEqual(
      buildReadyChat({ messages: [buildMessage()] }),
    );
  });

  it('leaves another waiting message alone', () => {
    const two = addPendingMessage(addPendingMessage(buildReadyChat(), 1, 'un'), 2, 'deux');

    expect(confirmPendingMessage(two, 1, buildMessage()).status === 'ready').toBe(true);
    expect(confirmPendingMessage(two, 1, buildMessage())).toEqual(
      buildReadyChat({
        messages: [buildMessage()],
        pending: [{ localId: 2, body: 'deux', failed: false }],
      }),
    );
  });
});

describe('setPendingMessageFailed', () => {
  it('marks the message the server refused', () => {
    const waiting = addPendingMessage(buildReadyChat(), 1, 'Je suis en route');

    expect(setPendingMessageFailed(waiting, 1, true)).toEqual(
      buildReadyChat({ pending: [{ localId: 1, body: 'Je suis en route', failed: true }] }),
    );
  });

  it('clears the mark when the message is retried', () => {
    const failed = setPendingMessageFailed(
      addPendingMessage(buildReadyChat(), 1, 'Je suis en route'),
      1,
      true,
    );

    expect(setPendingMessageFailed(failed, 1, false)).toEqual(
      buildReadyChat({ pending: [{ localId: 1, body: 'Je suis en route', failed: false }] }),
    );
  });
});

describe('findPendingMessage', () => {
  it('finds the message a tap is retrying', () => {
    const waiting = addPendingMessage(buildReadyChat(), 1, 'Je suis en route');

    expect(findPendingMessage(waiting, 1)).toEqual({
      localId: 1,
      body: 'Je suis en route',
      failed: false,
    });
  });

  it('has nothing to retry once the server confirmed the message', () => {
    const waiting = addPendingMessage(buildReadyChat(), 1, 'Je suis en route');

    expect(
      findPendingMessage(confirmPendingMessage(waiting, 1, buildMessage()), 1),
    ).toBeUndefined();
  });

  it('has nothing to retry while the history is loading', () => {
    expect(findPendingMessage({ status: 'loading' }, 1)).toBeUndefined();
  });
});
