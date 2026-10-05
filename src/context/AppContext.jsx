import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const AppContext = createContext();

// 초기 기본 더미 데이터
const INITIAL_ROLES = [
  { id: 'r1', name: '칠판 도우미', description: '쉬는 시간마다 칠판을 깨끗이 지웁니다.', icon: '🧹' },
  { id: 'r2', name: '우유 도우미', description: '아침 우유를 받아오고 정리합니다.', icon: '🥛' },
  { id: 'r3', name: '조명/에너지 도우미', description: '이동 수업 시 전등과 TV를 끕니다.', icon: '💡' },
  { id: 'r4', name: '책장 정리 도우미', description: '학급 문고를 정돈합니다.', icon: '📚' },
  { id: 'r5', name: '환기 도우미', description: '쉬는 시간 창문을 열어 환기합니다.', icon: '🍃' },
];

const INITIAL_STORE_ITEMS = [
  { id: 's1', name: '원하는 자리 1일 지정권', price: 300, description: '하루 동안 내가 원하는 자리에 앉을 수 있어요.', icon: '🪑', stock: 10 },
  { id: 's2', name: '자유시간 10분 이용권', price: 200, description: '자율 학습 시간에 10분간 보드게임이나 독서를 해요.', icon: '⏱️', stock: 15 },
  { id: 's3', name: '급식 먼저 먹기 쿠폰', price: 150, description: '줄 서지 않고 가장 먼저 급식을 받아요.', icon: '🍱', stock: 20 },
  { id: 's4', name: '선생님 우유 심부름 동행권', price: 100, description: '선생님과 함께 칭찬과 이야기를 나누며 이동해요.', icon: '🏃', stock: 30 },
];

const INITIAL_MISSIONS = [
  { id: 'm1', title: '아침 독서 10분 집중하기', reward: 50, icon: '📖' },
  { id: 'm2', title: '밝은 목소리로 선생님/친구에게 인사하기', reward: 30, icon: '😊' },
  { id: 'm3', title: '하교 전 내 책상 주변 깔끔히 정리하기', reward: 40, icon: '✨' },
];

const INITIAL_STUDENTS = [
  { id: 'st1', number: 1, name: '강민우', balance: 500, xp: 500, level: 6, roleId: 'r1', coupons: [], completedMissions: [], roleCompletedToday: false, avatar: '🐶' },
  { id: 'st2', number: 2, name: '김하은', balance: 350, xp: 350, level: 4, roleId: 'r2', coupons: [], completedMissions: ['m1'], roleCompletedToday: true, avatar: '🐱' },
  { id: 'st3', number: 3, name: '박서준', balance: 200, xp: 200, level: 3, roleId: 'r3', coupons: [], completedMissions: [], roleCompletedToday: false, avatar: '🐻' },
  { id: 'st4', number: 4, name: '이도현', balance: 450, xp: 450, level: 5, roleId: 'r4', coupons: [], completedMissions: ['m2'], roleCompletedToday: false, avatar: '🦊' },
  { id: 'st5', number: 5, name: '최유진', balance: 600, xp: 600, level: 7, roleId: 'r5', coupons: [], completedMissions: [], roleCompletedToday: false, avatar: '🐰' },
];

const INITIAL_TRANSACTIONS = [
  { id: 't1', studentId: 'st1', studentName: '강민우', type: 'GRANT', amount: 100, reason: '주간 1인 1역 완수', date: '2026-10-05 09:00' },
  { id: 't2', studentId: 'st2', studentName: '김하은', type: 'GRANT', amount: 50, reason: '아침 독서 미션 완료', date: '2026-10-05 09:30' },
];

const LOCAL_STORAGE_KEY = 'CLASS_ECONOMY_APP_DATA_V1';

export const AppProvider = ({ children }) => {
  // 상태 초기화 (LocalStorage 우선)
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('LocalStorage load error:', e);
    }
    return {
      pin: '0000',
      currencyName: '미소',
      currencySymbol: '🪙',
      students: INITIAL_STUDENTS,
      roles: INITIAL_ROLES,
      storeItems: INITIAL_STORE_ITEMS,
      missions: INITIAL_MISSIONS,
      transactions: INITIAL_TRANSACTIONS,
    };
  });

  // 모드 상태: 'teacher' | 'student'
  const [mode, setMode] = useState('teacher');
  // 선택된 학생 ID (학생 모드일 때 사용)
  const [activeStudentId, setActiveStudentId] = useState('st1');
  // 레벨업 팝업 알림용 상태
  const [levelUpInfo, setLevelUpInfo] = useState(null);

  // LocalStorage 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }
  }, [data]);

  // 레벨 계산 함수 (100XP당 1레벨)
  const calcLevel = (xp) => Math.floor(xp / 100) + 1;

  // 화폐 지급 / 차감
  const handleModifyCurrency = (studentIds, amount, reason, isGrant = true) => {
    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    const targetIds = Array.isArray(studentIds) ? studentIds : [studentIds];
    let newlyLeveledStudent = null;

    const updatedStudents = data.students.map((st) => {
      if (!targetIds.includes(st.id)) return st;

      let newBalance = isGrant ? st.balance + amount : Math.max(0, st.balance - amount);
      let newXp = isGrant ? st.xp + amount : st.xp; // 차감 시 XP 유지
      let newLevel = calcLevel(newXp);

      if (newLevel > st.level) {
        newlyLeveledStudent = { name: st.name, oldLevel: st.level, newLevel };
      }

      return {
        ...st,
        balance: newBalance,
        xp: newXp,
        level: newLevel,
      };
    });

    const newTransactions = targetIds.map((stId) => {
      const st = data.students.find((s) => s.id === stId);
      return {
        id: 't_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        studentId: stId,
        studentName: st ? st.name : '학생',
        type: isGrant ? 'GRANT' : 'DEDUCT',
        amount: isGrant ? amount : -amount,
        reason: reason || (isGrant ? '화폐 지급' : '화폐 차감'),
        date: nowStr,
      };
    });

    setData((prev) => ({
      ...prev,
      students: updatedStudents,
      transactions: [...newTransactions, ...prev.transactions],
    }));

    if (newlyLeveledStudent) {
      triggerConfetti();
      setLevelUpInfo(newlyLeveledStudent);
    }
  };

  // 레벨업 폭죽 효과
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // 학생 엑셀 일괄 추가/업데이트
  const handleImportStudents = (newStudentsList) => {
    const existingNums = new Set(data.students.map(s => s.number));
    const avatars = ['🐶', '🐱', '🐻', '🦊', '🐰', '🐼', '🐯', '🦁', '🐸', '🐵'];

    const formatted = newStudentsList.map((item, idx) => {
      const num = parseInt(item.number || item['번호'] || idx + 1, 10);
      const name = item.name || item['이름'] || `학생${num}`;
      const existing = data.students.find(s => s.number === num);

      if (existing) {
        return { ...existing, name };
      }

      return {
        id: 'st_' + Date.now() + '_' + idx,
        number: num,
        name: name,
        balance: 0,
        xp: 0,
        level: 1,
        roleId: '',
        coupons: [],
        completedMissions: [],
        roleCompletedToday: false,
        avatar: avatars[idx % avatars.length],
      };
    });

    setData((prev) => ({
      ...prev,
      students: formatted.sort((a, b) => a.number - b.number),
    }));
  };

  // 1인 1역 지정
  const handleAssignRole = (studentId, roleId) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((st) =>
        st.id === studentId ? { ...st, roleId } : st
      ),
    }));
  };

  // 1인 1역 완료 체크 (학생)
  const handleToggleRoleComplete = (studentId) => {
    const student = data.students.find(s => s.id === studentId);
    if (!student) return;

    const nextState = !student.roleCompletedToday;
    
    setData((prev) => ({
      ...prev,
      students: prev.students.map((st) =>
        st.id === studentId ? { ...st, roleCompletedToday: nextState } : st
      ),
    }));

    if (nextState) {
      // 1인 1역 수행 시 소정의 화폐/XP 보상 (예: 20원)
      handleModifyCurrency(studentId, 20, '1인 1역 수행 완료', true);
    }
  };

  // 미션 수행 완료 체크 (학생)
  const handleToggleMissionComplete = (studentId, missionId) => {
    const student = data.students.find(s => s.id === studentId);
    const mission = data.missions.find(m => m.id === missionId);
    if (!student || !mission) return;

    const isAlreadyDone = student.completedMissions?.includes(missionId);
    let updatedCompleted = [];

    if (isAlreadyDone) {
      updatedCompleted = student.completedMissions.filter(id => id !== missionId);
    } else {
      updatedCompleted = [...(student.completedMissions || []), missionId];
      // 미션 수행 보상
      handleModifyCurrency(studentId, mission.reward, `미션 완료: ${mission.title}`, true);
    }

    setData((prev) => ({
      ...prev,
      students: prev.students.map((st) =>
        st.id === studentId ? { ...st, completedMissions: updatedCompleted } : st
      ),
    }));
  };

  // 상점 상품 구매 (학생)
  const handleBuyProduct = (studentId, productId) => {
    const student = data.students.find(s => s.id === studentId);
    const product = data.storeItems.find(p => p.id === productId);

    if (!student || !product) return { success: false, message: '상품 정보를 찾을 수 없습니다.' };
    if (student.balance < product.price) return { success: false, message: '잔액이 부족합니다.' };
    if (product.stock <= 0) return { success: false, message: '품절된 상품입니다.' };

    const nowStr = new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    const newCoupon = {
      id: 'cp_' + Date.now(),
      productId: product.id,
      name: product.name,
      icon: product.icon,
      purchasedAt: nowStr,
      used: false,
    };

    // 화폐 차감 (XP는 차감되지 않음)
    const updatedStudents = data.students.map((st) => {
      if (st.id === studentId) {
        return {
          ...st,
          balance: st.balance - product.price,
          coupons: [newCoupon, ...st.coupons],
        };
      }
      return st;
    });

    // 재고 차감
    const updatedStore = data.storeItems.map((p) =>
      p.id === productId ? { ...p, stock: p.stock - 1 } : p
    );

    // 거래 기록
    const newTx = {
      id: 't_' + Date.now(),
      studentId,
      studentName: student.name,
      type: 'BUY',
      amount: -product.price,
      reason: `상점 구매: ${product.name}`,
      date: nowStr,
    };

    setData((prev) => ({
      ...prev,
      students: updatedStudents,
      storeItems: updatedStore,
      transactions: [newTx, ...prev.transactions],
    }));

    return { success: true, message: `${product.name} 쿠폰을 성공적으로 구매했습니다!` };
  };

  // 쿠폰 사용 완료 처리
  const handleUseCoupon = (studentId, couponId) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            coupons: st.coupons.map((cp) =>
              cp.id === couponId ? { ...cp, used: true } : cp
            ),
          };
        }
        return st;
      }),
    }));
  };

  // 교사 CRUD 관리 기능들
  const handleAddRole = (role) => {
    setData((prev) => ({
      ...prev,
      roles: [...prev.roles, { ...role, id: 'r_' + Date.now() }],
    }));
  };

  const handleAddStoreItem = (item) => {
    setData((prev) => ({
      ...prev,
      storeItems: [...prev.storeItems, { ...item, id: 's_' + Date.now() }],
    }));
  };

  const handleAddMission = (mission) => {
    setData((prev) => ({
      ...prev,
      missions: [...prev.missions, { ...mission, id: 'm_' + Date.now() }],
    }));
  };

  const handleDeleteStudent = (studentId) => {
    setData((prev) => ({
      ...prev,
      students: prev.students.filter((st) => st.id !== studentId),
    }));
  };

  // 데이터 내보내기 (JSON 백업 다운로드)
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `class_economy_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 데이터 불러오기 (JSON 파일 복원)
  const handleImportData = (jsonData) => {
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (parsed.students && parsed.roles) {
        setData(parsed);
        alert('데이터를 성공적으로 복원했습니다!');
      } else {
        alert('올바르지 않은 백업 파일 형식입니다.');
      }
    } catch (e) {
      alert('파일 읽기 오류가 발생했습니다.');
    }
  };

  const activeStudent = data.students.find((s) => s.id === activeStudentId) || data.students[0];

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        mode,
        setMode,
        activeStudentId,
        setActiveStudentId,
        activeStudent,
        levelUpInfo,
        setLevelUpInfo,
        handleModifyCurrency,
        handleImportStudents,
        handleAssignRole,
        handleToggleRoleComplete,
        handleToggleMissionComplete,
        handleBuyProduct,
        handleUseCoupon,
        handleAddRole,
        handleAddStoreItem,
        handleAddMission,
        handleDeleteStudent,
        handleExportData,
        handleImportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
