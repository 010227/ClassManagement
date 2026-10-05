import React from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, CheckCircle } from 'lucide-react';

export const MyCouponsCard = () => {
  const { activeStudent, handleUseCoupon } = useApp();

  if (!activeStudent) return null;

  const coupons = activeStudent.coupons || [];

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ticket color="#06b6d4" size={22} />
          내 보유 쿠폰함 ({coupons.filter(c => !c.used).length}장)
        </span>
      </div>

      {coupons.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          아직 보유한 쿠폰이 없습니다. 상점에서 마음에 드는 쿠폰을 구매해 보세요!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              style={{
                border: '1.5px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px',
                background: coupon.used ? '#f1f5f9' : '#ffffff',
                opacity: coupon.used ? 0.6 : 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>{coupon.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{coupon.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>구매일: {coupon.purchasedAt}</div>
              </div>

              <div style={{ marginTop: '12px' }}>
                {coupon.used ? (
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} color="#10b981" /> 사용 완료
                  </span>
                ) : (
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{ width: '100%' }}
                    onClick={() => {
                      if (window.confirm(`${coupon.name} 쿠폰을 사용하시겠습니까?`)) {
                        handleUseCoupon(activeStudent.id, coupon.id);
                      }
                    }}
                  >
                    사용하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
