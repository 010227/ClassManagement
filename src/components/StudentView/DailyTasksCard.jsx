import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Circle, Sparkles, Briefcase, CalendarCheck } from 'lucide-react';

export const DailyTasksCard = () => {
  const { activeStudent, data, handleToggleRoleComplete, handleToggleMissionComplete } = useApp();

  if (!activeStudent) return null;

  const role = data.roles.find((r) => r.id === activeStudent.roleId);

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarCheck color="#6366f1" size={22} />
          오늘 할 일 (체크리스트)
        </span>
        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
          수행 완료 시 화폐와 XP가 보상으로 지급돼요!
        </span>
      </div>

      {/* 1인 1역 카테고리 */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Briefcase size={16} color="#4f46e5" />
          내 1인 1역 (학급 역할)
        </h4>

        {role ? (
          <div
            className={`task-item ${activeStudent.roleCompletedToday ? 'completed' : ''}`}
            onClick={() => handleToggleRoleComplete(activeStudent.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="task-left">
              <div className="checkbox-custom">
                {activeStudent.roleCompletedToday ? <CheckCircle2 size={18} /> : <Circle size={18} color="#94a3b8" />}
              </div>
              <div>
                <div className="task-title">
                  {role.icon} {role.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{role.description}</div>
              </div>
            </div>
            <div className="reward-badge">
              <Sparkles size={12} /> +20 {data.currencyName}
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', fontSize: '0.88rem', color: '#94a3b8', textAlign: 'center' }}>
            아직 배정된 1인 1역이 없습니다. 교사에게 배정을 요청해 주세요!
          </div>
        )}
      </div>

      {/* 일일 미션 카테고리 */}
      <div>
        <h4 style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="#f59e0b" />
          오늘의 학급 미션
        </h4>

        {data.missions.map((mission) => {
          const isDone = activeStudent.completedMissions?.includes(mission.id);

          return (
            <div
              key={mission.id}
              className={`task-item ${isDone ? 'completed' : ''}`}
              onClick={() => handleToggleMissionComplete(activeStudent.id, mission.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="task-left">
                <div className="checkbox-custom">
                  {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} color="#94a3b8" />}
                </div>
                <div>
                  <div className="task-title">
                    {mission.icon} {mission.title}
                  </div>
                </div>
              </div>
              <div className="reward-badge">
                <Sparkles size={12} /> +{mission.reward} {data.currencyName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
