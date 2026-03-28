import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SocialPlatform } from '@/types';

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  connectPlatform: (platform: SocialPlatform) => void;
  disconnectPlatform: (platformId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user: User) => {
        set({ user, isLoggedIn: true });
      },
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
      connectPlatform: (platform: SocialPlatform) => {
        const user = get().user;
        if (!user) return;

        const updatedPlatforms = [...user.connectedPlatforms];
        const existingIndex = updatedPlatforms.findIndex(p => p.id === platform.id);
        
        const connectedPlatform: SocialPlatform = {
          ...platform,
          connected: true
        };
        
        if (existingIndex >= 0) {
          updatedPlatforms[existingIndex] = connectedPlatform;
        } else {
          updatedPlatforms.push(connectedPlatform);
        }

        set({
          user: {
            ...user,
            connectedPlatforms: updatedPlatforms,
          }
        });
      },
      disconnectPlatform: (platformId: string) => {
        const user = get().user;
        if (!user) return;

        const updatedPlatforms = user.connectedPlatforms.filter(p => p.id !== platformId);
        
        set({
          user: {
            ...user,
            connectedPlatforms: updatedPlatforms,
          }
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);