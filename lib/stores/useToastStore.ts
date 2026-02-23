import { create } from 'zustand';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
    visible: boolean;
    message: string;
    description?: string;
    type: ToastType;
    showToast: (options: { message: string; description?: string; type?: ToastType }) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    visible: false,
    message: '',
    description: undefined,
    type: 'info',
    showToast: ({ message, description, type = 'info' }) => {
        set({ visible: true, message, description, type });
    },
    hideToast: () => {
        set({ visible: false });
    },
}));
