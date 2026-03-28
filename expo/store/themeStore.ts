import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeType, FontType } from '@/types';
import { COLORS } from '@/constants/colors';

interface ThemeState {
  theme: ThemeType;
  primaryColor: string;
  secondaryColor: string;
  font: FontType;
  darkMode: boolean;
  setTheme: (theme: ThemeType) => void;
  setFont: (font: FontType) => void;
  toggleDarkMode: () => void;
  setPrimaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'neonGreen',
      primaryColor: COLORS.neonGreen.primary,
      secondaryColor: COLORS.neonGreen.secondary,
      font: 'system', // Default to system font
      darkMode: true,
      setTheme: (theme: ThemeType) => {
        set({
          theme,
          primaryColor: COLORS[theme].primary,
          secondaryColor: COLORS[theme].secondary,
        });
      },
      setFont: (font: FontType) => {
        set({ font });
      },
      toggleDarkMode: () => {
        set({ darkMode: !get().darkMode });
      },
      setPrimaryColor: (color: string) => {
        set({ primaryColor: color });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);