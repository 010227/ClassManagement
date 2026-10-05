import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserCheck, Download, Upload, Coins, Award } from 'lucide-react';

export const Header = ({ onRequirePin }) => {
  const {
    data,
    mode,
    setMode,
    activeStudentId,
    setActiveStudentId,
    handleExportData,
    handleImportData
  } = useApp();

  const handleModeClick = (newMode) => {
    if (newMode === 'teacher' && mode !== 'teacher') {
      onRequirePin();
    } else {
      setMode(newMode);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      handleImportData(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <header className="app-header">
      <div className="brand-logo">
        <h1>
          <span>우리반 키우기</span> 🌟
        </h1>
        <span className="brand-badge">초등 4학년</span>
      </div>

      <div className="header-actions">
        {/* 모드 전환 스위처 */}
        <div className="mode-switcher">
          <button
            className={`mode-btn ${mode === 'teacher' ? 'active' : ''}`}
            onClick={() => handleModeClick('teacher')}
          >
            <ShieldCheck size={16} />
            교사 모드
          </button>
          <button
            className={`mode-btn ${mode === 'student' ? 'active' : ''}`}
            onClick={() => handleModeClick('student')}
          >
            <UserCheck size={16} />
            학생 모드
          </button>
        </div>

        {/* 학생 모드일 때 학생 드롭다운 선택기 */}
        {mode === 'student' && (
          <select
            className="student-selector-select"
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
          >
            {data.students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.number}번 {st.name} (Lv.{st.level})
              </option>
            ))}
          </select>
        )}

        {/* 백업 및 복원 버튼 (교사 모드) */}
        {mode === 'teacher' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleExportData} title="백업 파일 저장">
              <Download size={14} />
              백업
            </button>
            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }} title="백업 파일 불러오기">
              <Upload size={14} />
              복원
              <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>
        )}
      </div>
    </header>
  );
};
