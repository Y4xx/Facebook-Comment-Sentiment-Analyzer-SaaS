import api from "./client";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthToken,
  Analysis,
  AnalysisCreate,
} from "./types";

// Auth API
export const authApi = {
  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>("/auth/register", data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthToken> => {
    const response = await api.post<AuthToken>("/auth/login", credentials);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

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
