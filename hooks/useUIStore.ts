import { create } from 'zustand'

interface UIStore {
  isTabBarSticky: boolean;
  setTabBarSticky: (val: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isTabBarSticky: false,
  setTabBarSticky: (val) => set({ isTabBarSticky: val }),
}))
