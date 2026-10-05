import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Trophy } from 'lucide-react';

export const LevelUpModal = () => {
  const { levelUpInfo, setLevelUpInfo } = useApp();

  if (!levelUpInfo) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content level-up-container" style={{ maxWidth: '420px' }}>
        <div className="level-up-badge">🎉</div>
        <div className="level-up-title">LEVEL UP!</div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
          축하합니다, {levelUpInfo.name} 학생!
        </h3>
        <p style={{ fontSize: '1.05rem', color: '#475569', marginBottom: '24px' }}>
          레벨이 <strong style={{ color: '#4f46e5' }}>Lv.{levelUpInfo.oldLevel}</strong>에서{' '}
          <strong style={{ color: '#f59e0b', fontSize: '1.3rem' }}>Lv.{levelUpInfo.newLevel}</strong>(으)로
          상승했습니다!
        </p>

        <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => setLevelUpInfo(null)}>
          <Sparkles size={18} /> 멋져요! 확인하기
        </button>
      </div>
    </div>
  );
};
