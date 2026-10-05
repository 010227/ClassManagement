import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, MinusCircle } from 'lucide-react';

export const CurrencyModal = ({ isOpen, onClose, targetStudents, isGrant }) => {
  const { data, handleModifyCurrency } = useApp();
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState('');

  if (!isOpen || targetStudents.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetIds = targetStudents.map((s) => s.id);
    handleModifyCurrency(targetIds, Number(amount), reason, isGrant);
    onClose();
  };

  const quickReasons = isGrant
    ? ['주간 1인 1역 완수', '아침 독서 미션 달성', '발표 및 수업 적극 참여', '친구 돕기 / 선행']
    : ['청소 미흡 / 미제출', '학급 규칙 위반', '준비물 미지참'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '420px' }}>
        <div className="modal-title">
          {isGrant ? <PlusCircle color="#10b981" size={24} /> : <MinusCircle color="#ef4444" size={24} />}
          <span>{isGrant ? '학급 화폐 지급' : '학급 화폐 차감'}</span>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
          대상 학생:{' '}
          <strong style={{ color: '#1e293b' }}>
            {targetStudents.length === 1
              ? `${targetStudents[0].number}번 ${targetStudents[0].name}`
              : `${targetStudents[0].name} 외 ${targetStudents.length - 1}명`}
          </strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">금액 ({data.currencyName})</label>
            <input
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={10}
              step={10}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">지급/차감 사유</label>
            <input
              type="text"
              className="form-input"
              placeholder="사유를 입력해 주세요 (예: 칠판 청소 우수)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>빠른 사유 선택:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {quickReasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="btn btn-sm btn-secondary"
                  style={{ fontSize: '0.78rem' }}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              취소
            </button>
            <button
              type="submit"
              className={`btn ${isGrant ? 'btn-success' : 'btn-danger'}`}
              style={{ flex: 1 }}
            >
              {isGrant ? '지급하기' : '차감하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
