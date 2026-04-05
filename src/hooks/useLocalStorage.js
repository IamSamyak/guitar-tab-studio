import { useEffect } from "react";
import { useTabStore } from "../store";

export const useLocalStorageSync = () => {
  const tab = useTabStore((state) => state.tab);
  const setTab = useTabStore((state) => state.setTab);

  // Load on mount
  useEffect(() => {
    const saved = localStorage.getItem("guitar_tab");
    if (saved) {
      setTab(JSON.parse(saved));
    }
  }, [setTab]);

  // Save on change
  useEffect(() => {
    localStorage.setItem("guitar_tab", JSON.stringify(tab));
  }, [tab]);
};