import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Download, Upload } from 'lucide-react';

export const ExcelUploadModal = ({ isOpen, onClose }) => {
  const { handleImportStudents } = useApp();
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          setErrorMsg('엑셀 파일에 데이터가 없습니다.');
          return;
        }

        // 파싱된 데이터 검증
        handleImportStudents(data);
        setErrorMsg('');
        alert(`${data.length}명의 학생 데이터가 성공적으로 등록/업데이트되었습니다!`);
        onClose();
      } catch (err) {
        console.error(err);
        setErrorMsg('엑셀 파싱 중 오류가 발생했습니다. 파일 형식을 확인해 주세요.');
      }
    };
    reader.readAsBinaryString(file);
  };

  // 예시 샘플 엑셀 템플릿 다운로드
  const handleDownloadTemplate = () => {
    const templateData = [
      { 번호: 1, 이름: '강민우' },
      { 번호: 2, 이름: '김하은' },
      { 번호: 3, 이름: '박서준' },
      { 번호: 4, 이름: '이도현' },
      { 번호: 5, item: '최유진' },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '학생목록');
    XLSX.writeFile(wb, '학급_학생_일괄등록_양식.xlsx');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '460px' }}>
        <div className="modal-title">
          <FileSpreadsheet color="#10b981" size={24} />
          <span>학생 엑셀 일괄 추가</span>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '16px' }}>
          <code>[번호, 이름]</code> 헤더가 포함된 엑셀(.xlsx) 또는 CSV 파일을 업로드해 주세요.
        </p>

        <div
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '30px',
            textAlign: 'center',
            background: '#f8fafc',
            marginBottom: '20px',
          }}
        >
          <Upload size={36} color="#64748b" style={{ marginBottom: '10px' }} />
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>
            엑셀 파일 선택하기
          </div>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            style={{ fontSize: '0.85rem' }}
          />
        </div>

        {errorMsg && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '14px', textAlign: 'center' }}>
            {errorMsg}
          </p>
        )}

        <div style={{ background: '#e0e7ff', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', color: '#3730a3', fontWeight: 600 }}>
            💡 양식이 없으신가요?
          </span>
          <button className="btn btn-sm btn-secondary" onClick={handleDownloadTemplate}>
            <Download size={14} /> 예시 양식 다운로드
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
