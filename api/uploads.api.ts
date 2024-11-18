import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAxiosInstance } from "./axios";

export const useUploadProfileImage = () => {
  const axiosInstance = useAxiosInstance();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      console.log("Executing file upload");
      const res = await axiosInstance.post(`/profile-image`, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: async (data) => {
      console.log("Upload success", data);
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Upload failed: ", error);
      alert("File upload failed. Please try again.");
    },
    retry: 3,
  });
};
