import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, MinusCircle, FileSpreadsheet, Trash2, Search, CheckSquare, Square } from 'lucide-react';
import { CurrencyModal } from './CurrencyModal';
import { ExcelUploadModal } from './ExcelUploadModal';

export const StudentList = () => {
  const { data, handleAssignRole, handleDeleteStudent } = useApp();
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 화폐 지급/차감 모달 상태
  const [modalState, setModalState] = useState({
    isOpen: false,
    targetStudents: [],
    isGrant: true,
  });

  // 엑셀 업로드 모달 상태
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  // 검색 필터링된 학생 목록
  const filteredStudents = data.students.filter(
    (st) =>
      st.name.includes(searchQuery) ||
      st.number.toString().includes(searchQuery)
  );

  // 전체 선택 / 해제
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  // 개별 선택 토글
  const handleToggleSelect = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 개별 지급/차감 버튼 클릭
  const openSingleModal = (student, isGrant) => {
    setModalState({
      isOpen: true,
      targetStudents: [student],
      isGrant,
    });
  };

  // 일괄 지급/차감 버튼 클릭
  const openBulkModal = (isGrant) => {
    const targets = data.students.filter((s) => selectedStudentIds.includes(s.id));
    if (targets.length === 0) return;
    setModalState({
      isOpen: true,
      targetStudents: targets,
      isGrant,
    });
  };

  return (
    <div className="card">
      <div className="card-title" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '1.2rem' }}>👥 전체 학생 화폐 & 역할 관리</span>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* 검색창 */}
          <div style={{ position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 10 }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '32px', width: '180px', padding: '6px 10px 6px 32px', fontSize: '0.88rem' }}
              placeholder="이름/번호 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* 엑셀 파일 일괄 추가 버튼 */}
          <button className="btn btn-sm btn-success" onClick={() => setIsExcelModalOpen(true)}>
            <FileSpreadsheet size={16} /> 엑셀 일괄 등록
          </button>
        </div>
      </div>

      {/* 다중 선택 액션 바 */}
      {selectedStudentIds.length > 0 && (
        <div
          style={{
            background: '#e0e7ff',
            border: '1px solid #c7d2fe',
            padding: '12px 18px',
            borderRadius: '12px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 700, color: '#3730a3', fontSize: '0.92rem' }}>
            {selectedStudentIds.length}명의 학생이 선택되었습니다.
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-success" onClick={() => openBulkModal(true)}>
              <PlusCircle size={14} /> 일괄 화폐 지급
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => openBulkModal(false)}>
              <MinusCircle size={14} /> 일괄 화폐 차감
            </button>
          </div>
        </div>
      )}

      {/* 학생 테이블 */}
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    filteredStudents.length > 0 &&
                    selectedStudentIds.length === filteredStudents.length
                  }
                />
              </th>
              <th>번호</th>
              <th>이름</th>
              <th>레벨 (XP)</th>
              <th>보유 화폐 잔액</th>
              <th>1인 1역 (학급 역할)</th>
              <th style={{ textAlign: 'center' }}>화폐 빠른 조작</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  등록된 학생이 없습니다. 엑셀 파일 등으로 학생을 등록해 주세요.
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => {
                const isSelected = selectedStudentIds.includes(st.id);
                const role = data.roles.find((r) => r.id === st.roleId);

                return (
                  <tr key={st.id} style={{ background: isSelected ? '#f5f3ff' : 'transparent' }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(st.id)}
                      />
                    </td>
                    <td style={{ fontWeight: 700 }}>{st.number}번</td>
                    <td style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      <span style={{ marginRight: '6px' }}>{st.avatar || '🎓'}</span>
                      {st.name}
                    </td>
                    <td>
                      <span className="level-tag">Lv.{st.level}</span>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '6px' }}>
                        ({st.xp} XP)
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1rem' }}>
                      {data.currencySymbol} {st.balance.toLocaleString()} {data.currencyName}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        value={st.roleId || ''}
                        onChange={(e) => handleAssignRole(st.id, e.target.value)}
                      >
                        <option value="">-- 역할 선택 안 함 --</option>
                        {data.roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.icon} {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => openSingleModal(st, true)}
                        >
                          <PlusCircle size={14} /> 지급
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => openSingleModal(st, false)}
                        >
                          <MinusCircle size={14} /> 차감
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => {
                          if (window.confirm(`${st.name} 학생을 목록에서 삭제하시겠습니까?`)) {
                            handleDeleteStudent(st.id);
                          }
                        }}
                      >
                        <Trash2 size={14} color="#ef4444" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 화폐 지급/차감 모달 */}
      <CurrencyModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        targetStudents={modalState.targetStudents}
        isGrant={modalState.isGrant}
      />

      {/* 엑셀 일괄 업로드 모달 */}
      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
      />
    </div>
  );
};
