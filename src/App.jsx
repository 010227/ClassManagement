import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TeacherDashboard } from './components/TeacherView/TeacherDashboard';
import { StudentDashboard } from './components/StudentView/StudentDashboard';
import { PinModal } from './components/PinModal';
import { LevelUpModal } from './components/LevelUpModal';

const MainContent = () => {
  const { mode, setMode } = useApp();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleRequirePin = () => {
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    setMode('teacher');
  };

  return (
    <div className="app-container">
      <Header onRequirePin={handleRequirePin} />

      <main>
        {mode === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </main>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      <LevelUpModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
