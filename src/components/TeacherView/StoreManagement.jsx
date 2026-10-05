import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, Plus, Trash2 } from 'lucide-react';

export const StoreManagement = () => {
  const { data, handleAddStoreItem, setData } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(200);
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🎁');
  const [stock, setStock] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    handleAddStoreItem({ name, price: Number(price), description, icon, stock: Number(stock) });
    setName('');
    setPrice(200);
    setDescription('');
    setIsAdding(false);
  };

  const handleDelete = (itemId) => {
    if (window.confirm('이 상품을 삭제하시겠습니까?')) {
      setData((prev) => ({
        ...prev,
        storeItems: prev.storeItems.filter((i) => i.id !== itemId),
      }));
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag color="#ec4899" size={22} />
          학급 상점 상품 관리
        </span>
        <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> 새 상품 등록
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>새 상품 추가</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 2fr 1fr 1fr 2fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">아이콘</label>
              <input type="text" className="form-input" value={icon} onChange={(e) => setIcon(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">상품명</label>
              <input type="text" className="form-input" placeholder="예: 자리 지정권" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">가격({data.currencyName})</label>
              <input type="number" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">재고 수량</label>
              <input type="number" className="form-input" value={stock} onChange={(e) => setStock(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">상품 설명</label>
              <input type="text" className="form-input" placeholder="예: 원하는 자리 1일 이용" value={description} onChange={(e) => setDescription(e.target.value)} />
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
              <th>상품명</th>
              <th>가격</th>
              <th>남은 수량</th>
              <th>설명</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {data.storeItems.map((item) => (
              <tr key={item.id}>
                <td style={{ fontSize: '1.4rem' }}>{item.icon}</td>
                <td style={{ fontWeight: 700 }}>{item.name}</td>
                <td style={{ fontWeight: 800, color: '#f59e0b' }}>
                  {data.currencySymbol} {item.price} {data.currencyName}
                </td>
                <td>
                  <span className={`brand-badge ${item.stock === 0 ? 'btn-danger' : ''}`}>
                    {item.stock}개 남음
                  </span>
                </td>
                <td style={{ color: '#64748b' }}>{item.description}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
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
