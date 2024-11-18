import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "./axios";

export const useFavoriteMovies = () => {
  const axiosInstance = useAxiosInstance();
  return useQuery({
    queryKey: ["userFavoriteMovies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/favorites");
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    retry: 3,
  });
};

export const useDeleteFavoriteMovie = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: number) => {
      const res = await axiosInstance.delete(`/favorites`, {
        data: { movieId },
      });
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userFavoriteMovies"] });
    },
  });
};

export const useAddFavoriteMovie = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (movieId: number) => {
      const res = await axiosInstance.post(`/favorites`, { movieId });
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userFavoriteMovies"] });
    },
  });
};
