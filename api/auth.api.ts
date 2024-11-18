import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "./axios";

export const useLogin = () => {
  const axiosInstance = useAxiosInstance();
  return useMutation({
    mutationFn: async (user: any) => {
      const res = await axiosInstance.post(`/auth/login`, user);
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
  });
};

export const useSetUserNickname = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance();
  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await axiosInstance.patch(`/auth/user`, payload);
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useGetUserProfile = () => {
  const axiosInstance = useAxiosInstance();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/auth/user`);
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    retry: 3,
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxiosInstance();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.delete(`/auth/user`);
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      // console.log("Log from auth.api.ts: ",res.data);
      return res;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
