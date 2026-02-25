import { useState, useCallback } from 'react';

/**
 * useModal — simple hook to manage ConfirmModal state.
 *
 * Usage:
 *   const { modalProps, showAlert, showConfirm } = useModal();
 *
 *   // Show a simple alert (OK only)
 *   showAlert({ title: 'Done!', message: 'Post published!', type: 'success' });
 *
 *   // Show a confirm dialog and await result
 *   const yes = await showConfirm({ title: 'Delete?', message: 'Cannot be undone.', type: 'danger' });
 *   if (yes) deletePost(id);
 *
 *   // In JSX:
 *   <ConfirmModal {...modalProps} />
 */
export default function useModal() {
  const [state, setState] = useState({
    show: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    resolve: null,
  });

  const open = useCallback((opts) => {
    return new Promise((resolve) => {
      setState({
        show: true,
        type: opts.type || 'confirm',
        title: opts.title || 'Confirm',
        message: opts.message || '',
        confirmText: opts.confirmText || 'OK',
        cancelText: opts.cancelText || 'Cancel',
        resolve,
      });
    });
  }, []);

  const close = useCallback((result) => {
    setState(prev => {
      prev.resolve?.(result);
      return { ...prev, show: false };
    });
  }, []);

  const showAlert = useCallback((opts) => {
    return open({ ...opts, type: opts.type || 'alert', confirmText: opts.confirmText || 'OK' });
  }, [open]);

  const showConfirm = useCallback((opts) => {
    return open({ ...opts, type: opts.type || 'confirm' });
  }, [open]);

  const modalProps = {
    show: state.show,
    type: state.type,
    title: state.title,
    message: state.message,
    confirmText: state.confirmText,
    cancelText: state.cancelText,
    onConfirm: () => close(true),
    onCancel: () => close(false),
  };

  return { modalProps, showAlert, showConfirm };
}