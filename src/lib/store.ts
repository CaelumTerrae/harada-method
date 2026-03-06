"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { HaradaChart, Subgoal } from "./types";

type HaradaStore = {
  charts: HaradaChart[];
  addChart: (mainGoal: string, subgoals: Subgoal[]) => string;
  deleteChart: (id: string) => void;
  getChart: (id: string) => HaradaChart | undefined;
};

export const useHaradaStore = create<HaradaStore>()(
  persist(
    (set, get) => ({
      charts: [],

      addChart: (mainGoal, subgoals) => {
        const id = nanoid(10);
        const chart: HaradaChart = {
          id,
          createdAt: new Date().toISOString(),
          mainGoal,
          subgoals,
        };
        set((state) => ({ charts: [chart, ...state.charts] }));
        return id;
      },

      deleteChart: (id) => {
        set((state) => ({ charts: state.charts.filter((c) => c.id !== id) }));
      },

      getChart: (id) => {
        return get().charts.find((c) => c.id === id);
      },
    }),
    {
      name: "harada-charts",
    }
  )
);
