import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock } from 'lucide-react';

export const PinModal = ({ isOpen, onClose, onSuccess }) => {
  const { data } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === data.pin) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('비밀번호가 올바르지 않습니다. (기본: 0000)');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '380px', textCenter: 'center' }}>
        <div className="modal-title" style={{ justifyContent: 'center' }}>
          <Lock color="#6366f1" size={24} />
          <span>교사 모드 인증</span>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px', textAlign: 'center' }}>
          교사 화면 진입을 위해 4자리 PIN을 입력해 주세요. (초기 비밀번호: <strong>0000</strong>)
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              style={{ fontSize: '1.4rem', textAlign: 'center', letterSpacing: '8px' }}
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              autoFocus
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '14px', textAlign: 'center' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
