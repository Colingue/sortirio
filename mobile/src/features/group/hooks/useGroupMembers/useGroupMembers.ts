import { useEffect, useState } from 'react';

import { type MessageAuthor } from '@/features/chat/helpers/groupMessages/groupMessages';
import { fetchMessageAuthors } from '@/features/group/helpers/groupMembers/groupMembers';

export function useGroupMembers(groupId: string): Map<string, MessageAuthor> {
  const [authorsById, setAuthorsById] = useState<Map<string, MessageAuthor>>(new Map());

  useEffect(() => {
    let cancelled = false;

    fetchMessageAuthors(groupId)
      .then((authors) => !cancelled && setAuthorsById(authors))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return authorsById;
}
