import React from 'react';
import { StudentHeaderCard } from './StudentHeaderCard';
import { DailyTasksCard } from './DailyTasksCard';
import { StudentStoreCard } from './StudentStoreCard';
import { MyCouponsCard } from './MyCouponsCard';
import { TransactionHistory } from './TransactionHistory';

export const StudentDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. 상단 프로필 & 잔액 요약 */}
      <StudentHeaderCard />

      {/* 2. 오늘 할 일 (1인 1역 & 일일 미션) */}
      <DailyTasksCard />

      {/* 3. 학급 상점 */}
      <StudentStoreCard />

      {/* 4. 내 쿠폰함 & 거래 내역 2열 레이아웃 */}
      <div className="grid-2">
        <MyCouponsCard />
        <TransactionHistory />
      </div>
    </div>
  );
};
