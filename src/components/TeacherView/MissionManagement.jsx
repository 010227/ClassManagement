import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

export const MissionManagement = () => {
  const { data, handleAddMission, setData } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [reward, setReward] = useState(30);
  const [icon, setIcon] = useState('🌟');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    handleAddMission({ title, reward: Number(reward), icon });
    setTitle('');
    setReward(30);
    setIsAdding(false);
  };

  const handleDelete = (missionId) => {
    if (window.confirm('이 일일 미션을 삭제하시겠습니까?')) {
      setData((prev) => ({
        ...prev,
        missions: prev.missions.filter((m) => m.id !== missionId),
      }));
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles color="#f59e0b" size={22} />
          일일 미션 관리
        </span>
        <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> 새 미션 등록
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>새 미션 추가</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 2fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">아이콘</label>
              <input type="text" className="form-input" value={icon} onChange={(e) => setIcon(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">미션 설명</label>
              <input type="text" className="form-input" placeholder="예: 아침 서독 10분 집중하기" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">완수 보상({data.currencyName})</label>
              <input type="number" className="form-input" value={reward} onChange={(e) => setReward(e.target.value)} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-sm btn-secondary" onClick={() => setIsAdding(false)}>취소</button>
            <button type="submit" className="btn btn-sm btn-primary">저장하기</button>
          </div>
        </form>
      )}

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>아이콘</th>
              <th>미션 제목</th>
              <th>완수 보상</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {data.missions.map((mission) => (
              <tr key={mission.id}>
                <td style={{ fontSize: '1.4rem' }}>{mission.icon}</td>
                <td style={{ fontWeight: 700 }}>{mission.title}</td>
                <td>
                  <span className="reward-badge">
                    <Sparkles size={12} /> +{mission.reward} {data.currencyName}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(mission.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
