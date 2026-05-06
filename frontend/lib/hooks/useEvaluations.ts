import { useQuery } from '@tanstack/react-query';
import api from '../api';
import { Evaluation } from '../types';

export const useEvaluations = (limit: number = 30, offset: number = 0) => {
  return useQuery({
    queryKey: ['evaluations', limit, offset],
    queryFn: async () => {
      const { data } = await api.get<Evaluation[]>('/evaluations', {
        params: { limit, offset },
      });
      return data;
    },
    staleTime: 60000,
  });
};

export const useLatestEvaluation = () => {
  return useQuery({
    queryKey: ['evaluations', 'latest'],
    queryFn: async () => {
      const { data } = await api.get<Evaluation | null>('/evaluations/latest');
      return data;
    },
    staleTime: 60000,
  });
};
