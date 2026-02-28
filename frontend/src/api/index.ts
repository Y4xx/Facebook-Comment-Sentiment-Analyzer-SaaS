import api from "./client";
import type {
  Analysis,
  AnalysisCreate,
} from "./types";

// Analysis API
export const analysisApi = {
  create: async (data: AnalysisCreate): Promise<Analysis> => {
    const response = await api.post<Analysis>("/analyses", data);
    return response.data;
  },

  getAll: async (skip = 0, limit = 50): Promise<Analysis[]> => {
    const response = await api.get<Analysis[]>("/analyses", {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Analysis> => {
    const response = await api.get<Analysis>(`/analyses/${id}`);
    return response.data;
  },
};

export { api };
