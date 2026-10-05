import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const TransactionHistory = () => {
  const { activeStudent, data } = useApp();

  if (!activeStudent) return null;

  const myTransactions = data.transactions.filter(
    (t) => t.studentId === activeStudent.id
  );

  return (
    <div className="card">
      <div className="card-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <History color="#6366f1" size={22} />
          내 화폐 거래 내역
        </span>
      </div>

      {myTransactions.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
          아직 거래 내역이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myTransactions.map((tx) => {
            const isPositive = tx.amount > 0;
            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isPositive ? '#dcfce7' : '#fee2e2',
                      color: isPositive ? '#166534' : '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isPositive ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tx.reason}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{tx.date}</div>
                  </div>
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '1rem',
                    color: isPositive ? '#16a34a' : '#dc2626',
                  }}
                >
                  {isPositive ? `+${tx.amount}` : tx.amount} {data.currencyName}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
