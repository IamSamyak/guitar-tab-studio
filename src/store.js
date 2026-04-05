import { create } from "zustand";

export const useTabStore = create((set) => ({
  tab: {
    title: "Untitled",
    tempo: 120,
    capo: 0,
    tracks: []
  },

  setTab: (tab) => set({ tab }),

  updateTab: (updates) =>
    set((state) => ({
      tab: { ...state.tab, ...updates }
    }))
}));