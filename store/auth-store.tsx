import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo o tipo do estado de autenticação
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,

  login: async (token: string) => {
    try {
      await AsyncStorage.setItem('token-desafio', token);
      set({ isAuthenticated: true, token });
    } catch (error) {
      console.error('Error storing the token', error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token-desafio');
      set({ isAuthenticated: false, token: null });
    } catch (error) {
      console.error('Error removing the token', error);
    }
  },

  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token-desafio');
      if (token) {
        set({ isAuthenticated: true, token });
      }
    } catch (error) {
      console.error('Error loading the token', error);
    }
  }
}));

export default useAuthStore;
