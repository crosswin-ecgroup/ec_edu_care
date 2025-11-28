import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { deleteItem, getItem, saveItem } from '../utils/secure-store';

interface AuthState {
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: any | null;
    setAuth: (token: string, refreshToken: string, user?: any) => void;
    clearAuth: () => void;
    loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,
            setAuth: (token, refreshToken, user) => {
                set({ token, refreshToken, user, isAuthenticated: true });
            },
            clearAuth: () => {
                set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
            },
            loadAuth: async () => {
                // This is handled by persist middleware mostly, but if we need manual loading from secure store:
                // The persist middleware with custom storage is the better way.
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => ({
                getItem: getItem,
                setItem: saveItem,
                removeItem: deleteItem,
            })),
        }
    )
);
