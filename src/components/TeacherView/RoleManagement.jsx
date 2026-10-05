import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

export const RoleManagement = () => {
  const { data, handleAddRole, setData } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🧹');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    handleAddRole({ name, description, icon });
    setName('');
    setDescription('');
    setIsAdding(false);
  };

  const handleDelete = (roleId) => {
    if (window.confirm('이 1인 1역을 삭제하시겠습니까?')) {
      setData((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r.id !== roleId),
        students: prev.students.map((st) => (st.roleId === roleId ? { ...st, roleId: '' } : st)),
      }));
    }
  };

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase color="#4f46e5" size={22} />
          1인 1역 (학급 역할) 관리
        </span>
        <button className="btn btn-sm btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> 새 역할 등록
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>새 역할 추가</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label className="form-label">아이콘</label>
              <input type="text" className="form-input" value={icon} onChange={(e) => setIcon(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">역할 이름</label>
              <input type="text" className="form-input" placeholder="예: 칠판 도우미" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="form-label">역할 설명</label>
              <input type="text" className="form-input" placeholder="예: 쉬는 시간 칠판 청소" value={description} onChange={(e) => setDescription(e.target.value)} />
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
              <th>역할명</th>
              <th>설명</th>
              <th>현재 담당 학생</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {data.roles.map((role) => {
              const assignedStudents = data.students.filter((st) => st.roleId === role.id);
              return (
                <tr key={role.id}>
                  <td style={{ fontSize: '1.4rem' }}>{role.icon}</td>
                  <td style={{ fontWeight: 700 }}>{role.name}</td>
                  <td style={{ color: '#64748b' }}>{role.description}</td>
                  <td>
                    {assignedStudents.length > 0 ? (
                      assignedStudents.map((s) => (
                        <span key={s.id} className="brand-badge" style={{ marginRight: '4px' }}>
                          {s.number}번 {s.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>미배정</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(role.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
