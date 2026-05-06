import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import { Habit } from '../types';

export const useHabits = () => {
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data } = await api.get<Habit[]>('/habits');
      return data;
    },
    staleTime: 60000,
  });

  const createHabitMutation = useMutation({
    mutationFn: async (habit: Partial<Habit>) => {
      const { data } = await api.post<Habit>('/habits', habit);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  const logHabitMutation = useMutation({
    mutationFn: async ({ habitId, value }: { habitId: string; value: number }) => {
      const { data } = await api.post(`/habits/${habitId}/log`, { logged_value: value });
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['heatmap', variables.habitId] });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      await api.delete(`/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  return {
    habits: habitsQuery.data || [],
    isLoading: habitsQuery.isLoading,
    createHabit: createHabitMutation.mutateAsync,
    logHabit: logHabitMutation.mutateAsync,
    deleteHabit: deleteHabitMutation.mutateAsync,
  };
};
