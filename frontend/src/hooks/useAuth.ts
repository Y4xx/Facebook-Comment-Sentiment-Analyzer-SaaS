import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api";
import type { LoginCredentials, RegisterData } from "@/api/types";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.getMe,
    retry: false,
    enabled: !!localStorage.getItem("access_token"),
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      navigate("/login");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    queryClient.clear();
    navigate("/login");
  };

  const login = (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = (data: RegisterData) => {
    return registerMutation.mutateAsync(data);
  };

  const isAuthenticated = !!localStorage.getItem("access_token") && !!user;

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    loginMutation,
    register,
    registerMutation,
    logout,
  };
}
