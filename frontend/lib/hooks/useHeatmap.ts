import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { HeatmapData } from '../types';

export const useHeatmap = (habitId: string, year: number = new Date().getFullYear()) => {
  return useQuery({
    queryKey: ['heatmap', habitId, year],
    queryFn: async () => {
      const { data } = await api.get<HeatmapData>(`/heatmap/${habitId}`, {
        params: { year },
      });
      return data;
    },
    staleTime: 60000,
    placeholderData: (previousData) => {
      // Generate empty year data as placeholder
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      const emptyData = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        emptyData.push({
          date: d.toISOString().split('T')[0],
          completed: false,
          value: 0,
        });
      }
      return {
        habit_id: habitId,
        year,
        data: emptyData,
        current_streak: 0,
        longest_streak: 0,
        completion_rate: 0,
      } as HeatmapData;
    },
  });
};
