import { useEffect, useRef } from 'react';

/**
 * Reusable Modal component for alerts and confirmations.
 *
 * Props:
 *  - show        {boolean}   — whether modal is visible
 *  - type        {string}    — "alert" | "confirm" | "success" | "danger" | "warning"
 *  - title       {string}    — modal heading
 *  - message     {string}    — body text
 *  - confirmText {string}    — confirm button label (default "OK")
 *  - cancelText  {string}    — cancel button label (default "Cancel")
 *  - onConfirm   {function}  — called when confirm button clicked
 *  - onCancel    {function}  — called when cancel / close clicked
 */

const ICONS = {
  alert:   { icon: 'bi-info-circle-fill',    color: '#3b82f6' },
  confirm: { icon: 'bi-question-circle-fill', color: '#f59e0b' },
  success: { icon: 'bi-check-circle-fill',   color: '#22c55e' },
  danger:  { icon: 'bi-exclamation-triangle-fill', color: '#dc3545' },
  warning: { icon: 'bi-exclamation-circle-fill',   color: '#f59e0b' },
};

export default function ConfirmModal({
  show,
  type = 'confirm',
  title = 'Confirm',
  message = '',
  confirmText = 'OK',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const backdropRef = useRef(null);

  // close on Escape key
  useEffect(() => {
    if (!show) return;
    const handler = (e) => { if (e.key === 'Escape') onCancel?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [show, onCancel]);

  if (!show) return null;

  const { icon, color } = ICONS[type] || ICONS.confirm;
  const isAlertOnly = type === 'alert' || type === 'success';

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={(e) => { if (e.target === backdropRef.current) onCancel?.(); }}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.15s ease',
        }}
      >
        {/* Modal box */}
        <div style={{
          background: 'var(--surface, #1e1e1e)',
          border: '1px solid rgba(220,53,69,0.2)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.2s ease',
        }}>

          {/* Header */}
          <div style={{
            padding: '1.5rem 1.5rem 0',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
          }}>
            {/* Icon */}
            <div style={{
              width: '48px', height: '48px', flexShrink: 0,
              background: `${color}18`,
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className={`bi ${icon}`} style={{ fontSize: '1.5rem', color }}></i>
            </div>

            {/* Title + close */}
            <div style={{ flex: 1 }}>
              <h5 style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                margin: '0 0 0.25rem',
                color: '#f0ece8',
                fontSize: '1.05rem',
              }}>
                {title}
              </h5>
              <p style={{
                color: '#9a9a9a',
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}>
                {message}
              </p>
            </div>

            <button
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6b6b6b',
                cursor: 'pointer',
                padding: '0',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}>
            {!isAlertOnly && (
              <button
                onClick={onCancel}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9a9a9a',
                  borderRadius: '8px',
                  padding: '0.55rem 1.25rem',
                  cursor: 'pointer',
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              style={{
                background: type === 'danger' ? '#dc3545' : type === 'success' ? '#22c55e' : type === 'alert' ? '#3b82f6' : '#dc3545',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                padding: '0.55rem 1.5rem',
                cursor: 'pointer',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '0.875rem',
                transition: 'opacity 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
              onMouseOut={e => e.currentTarget.style.opacity = '1'}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}