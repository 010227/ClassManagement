import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentList } from './StudentList';
import { RoleManagement } from './RoleManagement';
import { StoreManagement } from './StoreManagement';
import { MissionManagement } from './MissionManagement';
import { Users, Coins, Briefcase, Award } from 'lucide-react';

export const TeacherDashboard = () => {
  const { data } = useApp();
  const [activeTab, setActiveTab] = useState('students');

  const totalStudents = data.students.length;
  const totalCurrencyInCirculation = data.students.reduce((sum, s) => sum + s.balance, 0);
  const assignedRolesCount = data.students.filter((s) => Boolean(s.roleId)).length;
  const rolePercent = totalStudents > 0 ? Math.round((assignedRolesCount / totalStudents) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. 교사 현황 요약 카드 */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>학급 전체 학생 수</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{totalStudents} 명</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fde68a', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coins size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>총 유통 화폐 합계</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>
              {data.currencySymbol} {totalCurrencyInCirculation.toLocaleString()} {data.currencyName}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, #ffffff 0%, #dcfce7 100%)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#bbf7d0', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>1인 1역 배정 비율</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#166534' }}>
              {rolePercent}% ({assignedRolesCount}/{totalStudents}명)
            </div>
          </div>
        </div>
      </div>

      {/* 2. 관리 탭 메뉴 */}
      <div>
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👥 학생 및 화폐 관리
          </button>
          <button
            className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
            onClick={() => setActiveTab('roles')}
          >
            🧹 1인 1역 관리
          </button>
          <button
            className={`tab-btn ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            🛍️ 학급 상점 관리
          </button>
          <button
            className={`tab-btn ${activeTab === 'missions' ? 'active' : ''}`}
            onClick={() => setActiveTab('missions')}
          >
            🌟 일일 미션 관리
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'students' && <StudentList />}
        {activeTab === 'roles' && <RoleManagement />}
        {activeTab === 'store' && <StoreManagement />}
        {activeTab === 'missions' && <MissionManagement />}
      </div>
    </div>
  );
};
