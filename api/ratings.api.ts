import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "./axios";

export const useCreateRating = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, rating }) => {
      const res = await axiosInstance.post(`/ratings`, { movieId, rating });
      if (res.status === 500) {
        throw new Error("Internal server error");
      }
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["movies", movieId] });
    },
  });
};
