import React from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, Zap, Ticket } from 'lucide-react';

export const StudentHeaderCard = () => {
  const { activeStudent, data } = useApp();

  if (!activeStudent) return null;

  // 레벨업 경험치 계산 (Lv. N = (N-1)*100 ~ N*100)
  const currentXp = activeStudent.xp;
  const currentLevel = activeStudent.level;
  const currentLevelXpStart = (currentLevel - 1) * 100;
  const nextLevelXpNeeded = currentLevel * 100;

  const xpProgressInLevel = currentXp - currentLevelXpStart;
  const xpSpanForLevel = 100;
  const progressPercent = Math.min(100, Math.max(0, (xpProgressInLevel / xpSpanForLevel) * 100));

  const availableCouponsCount = activeStudent.coupons?.filter(c => !c.used).length || 0;

  return (
    <div className="student-hero-card">
      <div className="hero-profile-info">
        <div className="avatar-badge">{activeStudent.avatar || '🎓'}</div>
        <div className="profile-text" style={{ flex: 1 }}>
          <div className="student-name">
            {activeStudent.number}번 {activeStudent.name}
            <span className="level-tag">Lv.{activeStudent.level}</span>
          </div>

          <div className="xp-progress-container">
            <div className="xp-label">
              <span><Zap size={14} style={{ display: 'inline', marginRight: 4 }} /> 누적 경험치: {currentXp} XP</span>
              <span>다음 레벨까지: {nextLevelXpNeeded - currentXp} XP</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="hero-balance-row">
        <div>
          <div className="balance-title">내 보유 화폐</div>
          <div className="balance-amount">
            {data.currencySymbol} {activeStudent.balance.toLocaleString()} {data.currencyName}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.2)', padding: '8px 16px', borderRadius: '12px' }}>
          <Ticket size={20} color="#fde047" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>사용 가능 쿠폰: {availableCouponsCount}장</span>
        </div>
      </div>
    </div>
  );
};
