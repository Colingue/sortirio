import { useCallback, useEffect, useState } from 'react';

import { fetchMyReportedUserIds, saveMemberReport } from '@/features/group/helpers/report/report';

export type MemberReports = {
  reportedUserIds: Set<string>;
  saveMemberReport: (userId: string) => Promise<void>;
};

export function useMemberReports(): MemberReports {
  const [reportedUserIds, setReportedUserIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    fetchMyReportedUserIds()
      .then((ids) => !cancelled && setReportedUserIds(ids))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const saveReportAndRemember = useCallback(async (userId: string) => {
    await saveMemberReport(userId);
    setReportedUserIds((current) => new Set(current).add(userId));
  }, []);

  return { reportedUserIds, saveMemberReport: saveReportAndRemember };
}
