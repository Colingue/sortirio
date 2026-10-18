import { useState } from 'react';

export function usePullToRefresh(reload: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await reload();
    } finally {
      setRefreshing(false);
    }
  }

  return { refreshing, onRefresh: () => void handleRefresh() };
}
