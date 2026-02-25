import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              color: '#fff',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              fontSize: '0.9rem',
              backgroundColor: toast.type === 'success' ? '#198754' : toast.type === 'danger' ? '#dc3545' : '#0dcaf0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              animation: 'slideIn 0.3s ease',
              minWidth: '220px',
            }}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}