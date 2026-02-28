import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { analysisApi } from "@/api";
import type { AnalysisCreate } from "@/api/types";

export function useAnalyses() {
  return useQuery({
    queryKey: ["analyses"],
    queryFn: () => analysisApi.getAll(),
  });
}

export function useAnalysis(id: number) {
  return useQuery({
    queryKey: ["analysis", id],
    queryFn: () => analysisApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnalysisCreate) => analysisApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["analyses"] });
    },
  });
}
