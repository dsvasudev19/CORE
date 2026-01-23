import { proxy } from 'valtio';

/**
 * Global Application Store using Valtio
 * For UI state, user preferences, and non-server state
 */

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: number;
}

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  unreadNotifications: number;
  
  // Active Filters (for maintaining filter state across navigation)
  activeFilters: {
    employees?: any;
    projects?: any;
    tasks?: any;
    leave?: any;
    attendance?: any;
  };
  
  // Loading States
  globalLoading: boolean;
  
  // Modals
  activeModal: string | null;
  modalData: any;
}

export const appStore = proxy<AppState>({
  // User & Auth
  user: null,
  isAuthenticated: false,
  
  // UI State
  sidebarOpen: true,
  theme: 'light',
  
  // Notifications
  unreadNotifications: 0,
  
  // Active Filters
  activeFilters: {},
  
  // Loading States
  globalLoading: false,
  
  // Modals
  activeModal: null,
  modalData: null,
});

/**
 * Actions for App Store
 */
export const appActions = {
  // Auth Actions
  setUser: (user: User | null) => {
    appStore.user = user;
    appStore.isAuthenticated = !!user;
  },
  
  logout: () => {
    appStore.user = null;
    appStore.isAuthenticated = false;
    appStore.activeFilters = {};
  },
  
  // UI Actions
  toggleSidebar: () => {
    appStore.sidebarOpen = !appStore.sidebarOpen;
  },
  
  setSidebarOpen: (open: boolean) => {
    appStore.sidebarOpen = open;
  },
  
  setTheme: (theme: 'light' | 'dark' | 'system') => {
    appStore.theme = theme;
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  // Notification Actions
  setUnreadNotifications: (count: number) => {
    appStore.unreadNotifications = count;
  },
  
  incrementUnreadNotifications: () => {
    appStore.unreadNotifications += 1;
  },
  
  decrementUnreadNotifications: () => {
    if (appStore.unreadNotifications > 0) {
      appStore.unreadNotifications -= 1;
    }
  },
  
  // Filter Actions
  setFilter: (key: keyof AppState['activeFilters'], value: any) => {
    appStore.activeFilters[key] = value;
  },
  
  clearFilter: (key: keyof AppState['activeFilters']) => {
    delete appStore.activeFilters[key];
  },
  
  clearAllFilters: () => {
    appStore.activeFilters = {};
  },
  
  // Loading Actions
  setGlobalLoading: (loading: boolean) => {
    appStore.globalLoading = loading;
  },
  
  // Modal Actions
  openModal: (modalName: string, data?: any) => {
    appStore.activeModal = modalName;
    appStore.modalData = data;
  },
  
  closeModal: () => {
    appStore.activeModal = null;
    appStore.modalData = null;
  },
};
