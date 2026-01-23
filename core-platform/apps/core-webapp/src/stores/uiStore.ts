import { proxy } from 'valtio';

/**
 * UI-specific Store using Valtio
 * For managing UI state like modals, drawers, toasts, etc.
 */

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  // Modals
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: any;
    };
  };
  
  // Drawers
  drawers: {
    [key: string]: {
      isOpen: boolean;
      data?: any;
    };
  };
  
  // Toasts
  toasts: Toast[];
  
  // Loading Overlays
  loadingOverlays: Set<string>;
  
  // Confirmation Dialogs
  confirmDialog: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null;
}

export const uiStore = proxy<UIState>({
  modals: {},
  drawers: {},
  toasts: [],
  loadingOverlays: new Set(),
  confirmDialog: null,
});

/**
 * Actions for UI Store
 */
export const uiActions = {
  // Modal Actions
  openModal: (modalName: string, data?: any) => {
    uiStore.modals[modalName] = { isOpen: true, data };
  },
  
  closeModal: (modalName: string) => {
    if (uiStore.modals[modalName]) {
      uiStore.modals[modalName].isOpen = false;
    }
  },
  
  toggleModal: (modalName: string, data?: any) => {
    if (uiStore.modals[modalName]?.isOpen) {
      uiActions.closeModal(modalName);
    } else {
      uiActions.openModal(modalName, data);
    }
  },
  
  // Drawer Actions
  openDrawer: (drawerName: string, data?: any) => {
    uiStore.drawers[drawerName] = { isOpen: true, data };
  },
  
  closeDrawer: (drawerName: string) => {
    if (uiStore.drawers[drawerName]) {
      uiStore.drawers[drawerName].isOpen = false;
    }
  },
  
  toggleDrawer: (drawerName: string, data?: any) => {
    if (uiStore.drawers[drawerName]?.isOpen) {
      uiActions.closeDrawer(drawerName);
    } else {
      uiActions.openDrawer(drawerName, data);
    }
  },
  
  // Toast Actions
  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    uiStore.toasts.push({ ...toast, id });
    
    // Auto-remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      uiActions.removeToast(id);
    }, duration);
    
    return id;
  },
  
  removeToast: (id: string) => {
    const index = uiStore.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      uiStore.toasts.splice(index, 1);
    }
  },
  
  clearToasts: () => {
    uiStore.toasts = [];
  },
  
  // Loading Overlay Actions
  showLoading: (key: string) => {
    uiStore.loadingOverlays.add(key);
  },
  
  hideLoading: (key: string) => {
    uiStore.loadingOverlays.delete(key);
  },
  
  isLoading: (key: string) => {
    return uiStore.loadingOverlays.has(key);
  },
  
  // Confirmation Dialog Actions
  showConfirmDialog: (
    title: string,
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    uiStore.confirmDialog = {
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel,
    };
  },
  
  hideConfirmDialog: () => {
    uiStore.confirmDialog = null;
  },
  
  confirmDialogConfirm: () => {
    if (uiStore.confirmDialog?.onConfirm) {
      uiStore.confirmDialog.onConfirm();
    }
    uiActions.hideConfirmDialog();
  },
  
  confirmDialogCancel: () => {
    if (uiStore.confirmDialog?.onCancel) {
      uiStore.confirmDialog.onCancel();
    }
    uiActions.hideConfirmDialog();
  },
};
