import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, ShoppingCart, AlertCircle } from 'lucide-react';

export const StudentStoreCard = () => {
  const { activeStudent, data, handleBuyProduct } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [msg, setMsg] = useState(null);

  if (!activeStudent) return null;

  const onBuyConfirm = () => {
    if (!selectedProduct) return;
    const res = handleBuyProduct(activeStudent.id, selectedProduct.id);
    setMsg(res);
    setSelectedProduct(null);

    setTimeout(() => {
      setMsg(null);
    }, 3500);
  };

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag color="#ec4899" size={22} />
          학급 상점
        </span>
        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
          화폐로 쿠폰을 구매해도 레벨과 경험치는 그대로 유지돼요!
        </span>
      </div>

      {msg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '16px',
            background: msg.success ? '#f0fdf4' : '#fef2f2',
            color: msg.success ? '#166534' : '#991b1b',
            border: `1px solid ${msg.success ? '#bbf7d0' : '#fecaca'}`,
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {msg.message}
        </div>
      )}

      <div className="store-grid">
        {data.storeItems.map((item) => {
          const canAfford = activeStudent.balance >= item.price;
          const isOutOfStock = item.stock <= 0;

          return (
            <div key={item.id} className="product-card">
              <div className="product-icon">{item.icon}</div>
              <div className="product-name">{item.name}</div>
              <div className="product-desc">{item.description}</div>

              <div className="product-footer">
                <div className="product-price">
                  {data.currencySymbol} {item.price}
                </div>

                <button
                  className="btn btn-sm btn-primary"
                  disabled={!canAfford || isOutOfStock}
                  onClick={() => setSelectedProduct(item)}
                  style={{
                    opacity: !canAfford || isOutOfStock ? 0.5 : 1,
                    cursor: !canAfford || isOutOfStock ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ShoppingCart size={14} />
                  {isOutOfStock ? '품절' : !canAfford ? '잔액 부족' : '구매하기'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 구매 확인 모달 */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-title">
              <span>{selectedProduct.icon} 쿠폰 구매 확인</span>
            </div>
            <p style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '16px' }}>
              <strong>{selectedProduct.name}</strong> 쿠폰을 구매하시겠습니까?
            </p>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                <span>현재 잔액:</span>
                <span>{activeStudent.balance} {data.currencyName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px', color: '#dc2626' }}>
                <span>차감 금액:</span>
                <span>- {selectedProduct.price} {data.currencyName}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem', color: '#4f46e5' }}>
                <span>구매 후 잔액:</span>
                <span>{activeStudent.balance - selectedProduct.price} {data.currencyName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedProduct(null)}>
                취소
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={onBuyConfirm}>
                확인 및 구매
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
